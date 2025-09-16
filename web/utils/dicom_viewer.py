import pydicom
import numpy as np
from PIL import Image
import io
import os
import logging
from django.http import HttpResponse, JsonResponse
from django.core.files.storage import default_storage
import json

logger = logging.getLogger(__name__)


class DicomImageProcessor:    
    def __init__(self, file_path):
        self.file_path = file_path
        self.ds = None
        self.pixel_array = None
        self.metadata = {}
        self._load_dicom()
    
    def _load_dicom(self):
        try:
            self.ds = pydicom.dcmread(self.file_path, force=True)
            self._extract_metadata()
            
            if hasattr(self.ds, 'pixel_array'):
                self.pixel_array = self.ds.pixel_array
            else:
                raise ValueError("Arquivo DICOM não contém dados de imagem")
                
        except Exception as e:
            logger.error(f"Erro ao carregar DICOM {self.file_path}: {str(e)}")
            raise
    
    def _extract_metadata(self):
        """Extrai metadados médicos importantes"""
        self.metadata = {
            # Informações do Paciente
            'patient_name': str(getattr(self.ds, 'PatientName', 'N/A')),
            'patient_id': str(getattr(self.ds, 'PatientID', 'N/A')),
            'patient_age': str(getattr(self.ds, 'PatientAge', 'N/A')),
            'patient_sex': str(getattr(self.ds, 'PatientSex', 'N/A')),
            
            # Informações do Estudo
            'study_date': str(getattr(self.ds, 'StudyDate', 'N/A')),
            'study_time': str(getattr(self.ds, 'StudyTime', 'N/A')),
            'study_description': str(getattr(self.ds, 'StudyDescription', 'N/A')),
            'series_description': str(getattr(self.ds, 'SeriesDescription', 'N/A')),
            
            # Informações Técnicas
            'modality': str(getattr(self.ds, 'Modality', 'N/A')),
            'manufacturer': str(getattr(self.ds, 'Manufacturer', 'N/A')),
            'model_name': str(getattr(self.ds, 'ManufacturerModelName', 'N/A')),
            'institution_name': str(getattr(self.ds, 'InstitutionName', 'N/A')),
            
            # Parâmetros de Imagem
            'rows': str(getattr(self.ds, 'Rows', 'N/A')),
            'columns': str(getattr(self.ds, 'Columns', 'N/A')),
            'pixel_spacing': str(getattr(self.ds, 'PixelSpacing', 'N/A')),
            'slice_thickness': str(getattr(self.ds, 'SliceThickness', 'N/A')),
            
            # Window/Level
            'window_center': str(getattr(self.ds, 'WindowCenter', 'N/A')),
            'window_width': str(getattr(self.ds, 'WindowWidth', 'N/A')),
        }
        
        # Informações da imagem se disponível
        if self.pixel_array is not None:
            self.metadata.update({
                'image_shape': str(self.pixel_array.shape),
                'pixel_dtype': str(self.pixel_array.dtype),
                'pixel_min': str(self.pixel_array.min()),
                'pixel_max': str(self.pixel_array.max()),
            })
    
    def get_windowed_image(self, window_center=None, window_width=None, format='PNG'):
        """
        Aplica window/level e retorna imagem processada
        """
        if self.pixel_array is None:
            raise ValueError("Não há dados de imagem disponíveis")
        
        # Usa valores padrão do DICOM se não especificados
        if window_center is None:
            if hasattr(self.ds, 'WindowCenter') and self.ds.WindowCenter is not None:
                wc = self.ds.WindowCenter
                window_center = float(wc[0] if isinstance(wc, (list, tuple)) else wc)
            else:
                # Valores automáticos baseados na imagem
                window_center = float(self.pixel_array.mean())
        
        if window_width is None:
            if hasattr(self.ds, 'WindowWidth') and self.ds.WindowWidth is not None:
                ww = self.ds.WindowWidth
                window_width = float(ww[0] if isinstance(ww, (list, tuple)) else ww)
            else:
                # Valores automáticos baseados na imagem
                window_width = float(self.pixel_array.std() * 4)
        
        # Aplica window/level
        windowed_array = self._apply_window_level(self.pixel_array.copy(), window_center, window_width)
        
        # Normaliza para 0-255
        normalized_array = self._normalize_to_uint8(windowed_array)
        
        # Cria imagem PIL
        if len(normalized_array.shape) == 2:
            image = Image.fromarray(normalized_array, mode='L')
        else:
            image = Image.fromarray(normalized_array, mode='RGB')
        
        # Converte para buffer
        img_buffer = io.BytesIO()
        if format.upper() == 'PNG':
            image.save(img_buffer, format='PNG', compress_level=1)
        elif format.upper() == 'JPEG':
            image.save(img_buffer, format='JPEG', quality=95, optimize=True)
        
        img_buffer.seek(0)
        return img_buffer, {
            'window_center': window_center,
            'window_width': window_width,
            'applied_windowing': True
        }
    
    def get_auto_contrasted_image(self, format='PNG', percentile_clip=0.5):
        """
        Aplica contraste automático baseado em percentis
        """
        if self.pixel_array is None:
            raise ValueError("Não há dados de imagem disponíveis")
        
        # Calcula percentis para contraste automático
        low_percentile = np.percentile(self.pixel_array, percentile_clip)
        high_percentile = np.percentile(self.pixel_array, 100 - percentile_clip)
        
        # Aplica clipping
        contrasted_array = np.clip(self.pixel_array, low_percentile, high_percentile)
        
        # Normaliza
        normalized_array = self._normalize_to_uint8(contrasted_array)
        
        # Cria imagem
        if len(normalized_array.shape) == 2:
            image = Image.fromarray(normalized_array, mode='L')
        else:
            image = Image.fromarray(normalized_array, mode='RGB')
        
        # Converte para buffer
        img_buffer = io.BytesIO()
        if format.upper() == 'PNG':
            image.save(img_buffer, format='PNG', compress_level=1)
        elif format.upper() == 'JPEG':
            image.save(img_buffer, format='JPEG', quality=95, optimize=True)
        
        img_buffer.seek(0)
        return img_buffer, {
            'low_percentile': float(low_percentile),
            'high_percentile': float(high_percentile),
            'percentile_clip': percentile_clip,
            'applied_auto_contrast': True
        }
    
    def _apply_window_level(self, pixel_array, window_center, window_width):
        """Aplica transformação window/level"""
        min_val = window_center - window_width / 2
        max_val = window_center + window_width / 2
        
        # Aplica windowing
        windowed = np.clip(pixel_array, min_val, max_val)
        return windowed
    
    def _normalize_to_uint8(self, pixel_array):
        """Normaliza array para uint8 (0-255)"""
        # Converte para float64 para precisão
        pixel_array = pixel_array.astype(np.float64)
        
        # Normalização com preservação de detalhes
        pixel_min = pixel_array.min()
        pixel_max = pixel_array.max()
        
        if pixel_max > pixel_min:
            normalized = (pixel_array - pixel_min) / (pixel_max - pixel_min) * 255.0
        else:
            normalized = np.zeros_like(pixel_array)
        
        return np.round(normalized).astype(np.uint8)


def create_dicom_response(file_path, window_center=None, window_width=None, 
                         auto_contrast=False, format='PNG'):
    """
    Cria resposta HTTP com imagem DICOM processada
    """
    try:
        processor = DicomImageProcessor(file_path)
        
        if auto_contrast:
            img_buffer, processing_info = processor.get_auto_contrasted_image(format=format)
        else:
            img_buffer, processing_info = processor.get_windowed_image(
                window_center=window_center, 
                window_width=window_width, 
                format=format
            )
        
        # Cria resposta HTTP
        content_type = f'image/{format.lower()}'
        response = HttpResponse(img_buffer.getvalue(), content_type=content_type)
        
        # Headers para cache e informações
        response['Cache-Control'] = 'public, max-age=1800'  # 30 min cache
        response['X-DICOM-Processing'] = json.dumps(processing_info)
        response['Content-Length'] = len(img_buffer.getvalue())
        
        return response
        
    except Exception as e:
        logger.error(f"Erro ao processar DICOM {file_path}: {str(e)}")
        raise


def get_dicom_metadata_response(file_path):
    """
    Retorna metadados DICOM como JSON
    """
    try:
        processor = DicomImageProcessor(file_path)
        
        return JsonResponse({
            'success': True,
            'metadata': processor.metadata,
            'has_pixel_data': processor.pixel_array is not None,
            'file_path': os.path.basename(file_path)
        })
        
    except Exception as e:
        logger.error(f"Erro ao extrair metadados DICOM {file_path}: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e),
            'file_path': os.path.basename(file_path)
        }, status=500)


def get_dicom_window_presets(modality):
    """
    Retorna presets de window/level comuns para diferentes modalidades
    """
    presets = {
        'CT': {
            'lung': {'center': -600, 'width': 1200, 'name': 'Pulmão'},
            'mediastinum': {'center': 50, 'width': 400, 'name': 'Mediastino'},
            'abdomen': {'center': 60, 'width': 400, 'name': 'Abdome'},
            'bone': {'center': 400, 'width': 1800, 'name': 'Osso'},
            'brain': {'center': 40, 'width': 80, 'name': 'Cérebro'},
        },
        'MR': {
            'brain_t1': {'center': 600, 'width': 1200, 'name': 'Cérebro T1'},
            'brain_t2': {'center': 1000, 'width': 2000, 'name': 'Cérebro T2'},
            'spine': {'center': 500, 'width': 1000, 'name': 'Coluna'},
        },
        'CR': {  # Computed Radiography
            'chest': {'center': 2048, 'width': 4096, 'name': 'Tórax'},
            'bone': {'center': 2048, 'width': 2048, 'name': 'Osso'},
        },
        'DX': {  # Digital Radiography
            'chest': {'center': 2048, 'width': 4096, 'name': 'Tórax'},
            'bone': {'center': 2048, 'width': 2048, 'name': 'Osso'},
        }
    }
    
    return presets.get(modality.upper(), {
        'default': {'center': None, 'width': None, 'name': 'Automático'}
    })


def is_valid_dicom_image(file_path):
    """
    Verifica se é um arquivo DICOM válido com dados de imagem
    """
    try:
        ds = pydicom.dcmread(file_path, force=True)
        return hasattr(ds, 'pixel_array') or hasattr(ds, 'PixelData')
    except Exception as e:
        logger.debug(f"Arquivo {file_path} não é DICOM válido: {str(e)}")
        return False
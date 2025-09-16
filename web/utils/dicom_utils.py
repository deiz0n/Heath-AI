import pydicom
import numpy as np
from PIL import Image
import io
import os
from django.http import HttpResponse
from django.core.files.storage import default_storage
import logging

logger = logging.getLogger(__name__)


def is_dicom_file(file_path):
    try:
        # Primeiro verifica pela extensão comum
        common_dicom_extensions = ['.dcm', '.dicom', '.dic']
        file_extension = os.path.splitext(file_path)[1].lower()
        filename = os.path.basename(file_path).upper()
        
        # Verifica se é um DICOMDIR (comum em DICOM)
        if 'DICOMDIR' in filename:
            logger.info(f"Arquivo identificado como DICOMDIR: {file_path}")
            try:
                ds = pydicom.dcmread(file_path, force=True)
                return True
            except:
                logger.debug(f"DICOMDIR {file_path} não pôde ser lido como DICOM")
                return False
        
        # Se tem extensão DICOM conhecida, verifica o conteúdo
        if file_extension in common_dicom_extensions:
            try:
                ds = pydicom.dcmread(file_path, force=True)
                return hasattr(ds, 'pixel_array') or hasattr(ds, 'PixelData')
            except:
                return False
        
        # Se não tem extensão conhecida, tenta ler como DICOM mesmo assim
        # Alguns arquivos DICOM não têm extensão ou têm outras extensões
        try:
            logger.debug(f"Tentando ler arquivo sem extensão conhecida como DICOM: {file_path}")
            
            # Primeiro verifica por conteúdo binário (mais rápido)
            if is_likely_dicom_by_content(file_path):
                logger.debug(f"Arquivo {file_path} tem conteúdo binário compatível com DICOM")
                
                # Agora tenta uma leitura rápida só do header
                ds = pydicom.dcmread(file_path, force=True, stop_before_pixels=True)
                
                # Verifica se tem elementos DICOM básicos
                has_dicom_elements = (
                    hasattr(ds, 'SOPClassUID') or 
                    hasattr(ds, 'StudyInstanceUID') or 
                    hasattr(ds, 'Modality') or
                    hasattr(ds, 'PatientName')
                )
                
                if has_dicom_elements:
                    # Agora tenta ler com pixels para confirmar que é uma imagem
                    try:
                        ds_full = pydicom.dcmread(file_path, force=True)
                        has_image_data = hasattr(ds_full, 'pixel_array') or hasattr(ds_full, 'PixelData')
                        logger.debug(f"Arquivo {file_path} tem dados DICOM: {has_dicom_elements}, tem imagem: {has_image_data}")
                        return has_image_data
                    except:
                        # Se não conseguir ler pixels, mas tem estrutura DICOM, ainda pode ser válido
                        logger.debug(f"Arquivo {file_path} tem estrutura DICOM mas erro ao ler pixels")
                        return True
            
            return False
            
        except Exception as e:
            logger.debug(f"Arquivo {file_path} não é DICOM: {str(e)}")
            return False
            
    except Exception as e:
        logger.debug(f"Erro ao verificar se arquivo {file_path} é DICOM: {str(e)}")
        return False


def dicom_to_image_response(file_path, format='PNG'):
    try:
        logger.info(f"Iniciando conversão DICOM para imagem: {file_path}")
        
        # Lê o arquivo DICOM
        ds = pydicom.dcmread(file_path, force=True)
        
        # Verifica se é um DICOMDIR (que não tem dados de imagem)
        filename = os.path.basename(file_path).upper()
        if 'DICOMDIR' in filename:
            logger.warning(f"Arquivo DICOMDIR detectado, não contém dados de imagem: {file_path}")
            raise ValueError("DICOMDIR não contém dados de imagem")

        # Extrai os dados da imagem
        if not hasattr(ds, 'pixel_array'):
            logger.error(f"Arquivo DICOM não contém pixel_array: {file_path}")
            raise ValueError("Arquivo DICOM não contém dados de imagem")
        
        try:
            pixel_array = ds.pixel_array
            logger.info(f"Dados de imagem extraídos. Dimensões: {pixel_array.shape}")
        except Exception as e:
            logger.error(f"Erro ao extrair pixel_array: {str(e)}")
            raise ValueError(f"Erro ao extrair dados de imagem: {str(e)}")

        # Aplicar transformações de janela/nível se disponíveis
        pixel_array = apply_window_level(pixel_array, ds)

        # Normaliza os valores dos pixels para 0-255 com melhor preservação de qualidade
        pixel_array = normalize_pixel_array(pixel_array)

        # Cria imagem PIL
        if len(pixel_array.shape) == 2:
            # Imagem em escala de cinza
            image = Image.fromarray(pixel_array, mode='L')
            logger.info("Imagem criada em escala de cinza")
        elif len(pixel_array.shape) == 3:
            # Imagem colorida
            if pixel_array.shape[2] == 3:
                image = Image.fromarray(pixel_array, mode='RGB')
                logger.info("Imagem criada em RGB")
            elif pixel_array.shape[2] == 4:
                image = Image.fromarray(pixel_array, mode='RGBA')
                logger.info("Imagem criada em RGBA")
            else:
                # Se tiver mais canais, usa apenas os 3 primeiros
                image = Image.fromarray(pixel_array[:, :, :3], mode='RGB')
                logger.info("Imagem criada em RGB (canais extras ignorados)")
        else:
            raise ValueError("Formato de imagem DICOM não suportado")

        # Converte para buffer com qualidade máxima
        img_buffer = io.BytesIO()
        if format.upper() == 'PNG':
            # PNG sem perda de qualidade
            image.save(img_buffer, format='PNG', compress_level=1)
        elif format.upper() == 'JPEG':
            # JPEG com qualidade máxima
            image.save(img_buffer, format='JPEG', quality=98, optimize=True)
        else:
            # Default para PNG
            image.save(img_buffer, format='PNG', compress_level=1)
        
        img_buffer.seek(0)
        
        logger.info(f"Conversão DICOM concluída com sucesso. Tamanho: {len(img_buffer.getvalue())} bytes")

        # Retorna resposta HTTP
        content_type = f'image/{format.lower()}'
        response = HttpResponse(img_buffer.getvalue(), content_type=content_type)

        # Adiciona headers para cache otimizado
        response['Cache-Control'] = 'public, max-age=3600'
        response['Content-Length'] = len(img_buffer.getvalue())

        return response

    except Exception as e:
        logger.error(f"Erro ao processar arquivo DICOM {file_path}: {str(e)}")
        raise ValueError(f"Erro ao processar arquivo DICOM: {str(e)}")


def apply_window_level(pixel_array, ds):
    try:
        # Tenta obter window center e window width do DICOM
        if hasattr(ds, 'WindowCenter') and hasattr(ds, 'WindowWidth'):
            window_center = float(ds.WindowCenter[0]) if isinstance(ds.WindowCenter, (list, tuple)) else float(ds.WindowCenter)
            window_width = float(ds.WindowWidth[0]) if isinstance(ds.WindowWidth, (list, tuple)) else float(ds.WindowWidth)
            
            # Aplica a transformação de janela/nível
            min_val = window_center - window_width / 2
            max_val = window_center + window_width / 2
            
            pixel_array = np.clip(pixel_array, min_val, max_val)
            
        return pixel_array
        
    except Exception as e:
        logger.debug(f"Não foi possível aplicar window/level: {str(e)}")
        return pixel_array


def normalize_pixel_array(pixel_array):
    try:
        # Converte para float64 para melhor precisão
        pixel_array = pixel_array.astype(np.float64)
        
        # Evita divisão por zero
        pixel_min = pixel_array.min()
        pixel_max = pixel_array.max()
        
        if pixel_max > pixel_min:
            # Normalização linear preservando toda a gama dinâmica
            pixel_array = ((pixel_array - pixel_min) / (pixel_max - pixel_min)) * 255.0
        else:
            # Se todos os valores são iguais, define como zero
            pixel_array = np.zeros_like(pixel_array)
        
        # Converte para uint8 com arredondamento
        pixel_array = np.round(pixel_array).astype(np.uint8)
        
        return pixel_array
        
    except Exception as e:
        logger.error(f"Erro na normalização: {str(e)}")
        # Fallback para normalização básica
        pixel_array = pixel_array.astype(np.float64)
        pixel_array = (pixel_array - pixel_array.min()) / (pixel_array.max() - pixel_array.min()) * 255
        return pixel_array.astype(np.uint8)


def convert_dicom_to_png_buffer(file_path):
    try:
        ds = pydicom.dcmread(file_path)

        if hasattr(ds, 'pixel_array'):
            pixel_array = ds.pixel_array
        else:
            raise ValueError("Arquivo DICOM não contém dados de imagem")

        # Aplicar transformações de janela/nível se disponíveis
        pixel_array = apply_window_level(pixel_array, ds)

        # Normalização com melhor qualidade
        pixel_array = normalize_pixel_array(pixel_array)

        # Cria imagem
        if len(pixel_array.shape) == 2:
            image = Image.fromarray(pixel_array, mode='L')
        elif len(pixel_array.shape) == 3:
            if pixel_array.shape[2] == 3:
                image = Image.fromarray(pixel_array, mode='RGB')
            elif pixel_array.shape[2] == 4:
                image = Image.fromarray(pixel_array, mode='RGBA')
            else:
                image = Image.fromarray(pixel_array[:, :, :3], mode='RGB')
        else:
            raise ValueError("Formato de imagem DICOM não suportado")

        # Buffer PNG com compressão mínima para qualidade máxima
        img_buffer = io.BytesIO()
        image.save(img_buffer, format='PNG', compress_level=1)
        img_buffer.seek(0)

        return img_buffer

    except Exception as e:
        raise ValueError(f"Erro ao processar DICOM: {str(e)}")


def get_dicom_metadata(file_path):
    try:
        ds = pydicom.dcmread(file_path, force=True)
        metadata = {
            'patient_name': str(getattr(ds, 'PatientName', 'Não informado')),
            'patient_id': str(getattr(ds, 'PatientID', 'Não informado')),
            'study_date': str(getattr(ds, 'StudyDate', 'Não informado')),
            'modality': str(getattr(ds, 'Modality', 'Não informado')),
            'manufacturer': str(getattr(ds, 'Manufacturer', 'Não informado')),
            'study_description': str(getattr(ds, 'StudyDescription', 'Não informado')),
            'series_description': str(getattr(ds, 'SeriesDescription', 'Não informado')),
        }
        
        # Informações da imagem se disponíveis
        if hasattr(ds, 'pixel_array'):
            try:
                pixel_array = ds.pixel_array
                if len(pixel_array.shape) >= 2:
                    metadata['image_height'] = str(pixel_array.shape[0])
                    metadata['image_width'] = str(pixel_array.shape[1])
                    metadata['image_channels'] = str(pixel_array.shape[2] if len(pixel_array.shape) > 2 else 1)
                    metadata['pixel_spacing'] = str(getattr(ds, 'PixelSpacing', 'Não informado'))
            except Exception as e:
                logger.debug(f"Erro ao obter dimensões da imagem: {str(e)}")
        
        return metadata
        
    except Exception as e:
        logger.error(f"Erro ao extrair metadados DICOM de {file_path}: {str(e)}")
        return {
            'error': f'Erro ao processar metadados: {str(e)}',
            'patient_name': 'Erro',
            'modality': 'Desconhecido'
        }


def preprocess_uploaded_dicom(uploaded_file, convert_to_web_format=False):
    try:
        # Salva temporariamente o arquivo
        temp_path = f"/tmp/temp_dicom_{uploaded_file.name}"
        with open(temp_path, 'wb') as temp_file:
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)
        
        # Verifica se é DICOM
        if not is_dicom_file(temp_path):
            os.remove(temp_path)
            return None, "Arquivo não é um DICOM válido"
        
        # Extrai metadados
        metadata = get_dicom_metadata(temp_path)
        
        result = {
            'is_dicom': True,
            'metadata': metadata,
            'temp_path': temp_path
        }
        
        # Se solicitado, converte para formato web
        if convert_to_web_format:
            try:
                png_buffer = convert_dicom_to_png_buffer(temp_path)
                result['web_format_buffer'] = png_buffer
                result['web_format'] = 'PNG'
            except Exception as e:
                result['conversion_error'] = str(e)
        
        return result, None
        
    except Exception as e:
        logger.error(f"Erro no preprocessamento do arquivo DICOM: {str(e)}")
        return None, f"Erro no preprocessamento: {str(e)}"


def handle_dicomdir_file(file_path):
    try:
        logger.info(f"Processando arquivo DICOMDIR: {file_path}")
        
        # Lê o DICOMDIR
        ds = pydicom.dcmread(file_path, force=True)
        
        # DICOMDIR normalmente não contém dados de imagem diretamente
        # Ele contém referências para outros arquivos DICOM
        if hasattr(ds, 'DirectoryRecordSequence'):
            logger.info("DICOMDIR contém sequência de registros de diretório")
            
            # Procura por arquivos de imagem referenciados
            base_dir = os.path.dirname(file_path)
            
            for record in ds.DirectoryRecordSequence:
                if hasattr(record, 'ReferencedFileID'):
                    referenced_files = record.ReferencedFileID
                    logger.info(f"Arquivo referenciado encontrado: {referenced_files}")
                    
                    # Constrói o caminho para o arquivo referenciado
                    if isinstance(referenced_files, (list, tuple)):
                        referenced_path = os.path.join(base_dir, *referenced_files)
                    else:
                        referenced_path = os.path.join(base_dir, str(referenced_files))
                    
                    # Se encontrou um arquivo referenciado que existe, tenta processá-lo
                    if os.path.exists(referenced_path):
                        logger.info(f"Tentando processar arquivo referenciado: {referenced_path}")
                        try:
                            return dicom_to_image_response(referenced_path)
                        except:
                            continue
        
        # Se chegou até aqui, DICOMDIR não tem imagens utilizáveis
        raise ValueError("DICOMDIR não contém imagens acessíveis")
        
    except Exception as e:
        logger.error(f"Erro ao processar DICOMDIR {file_path}: {str(e)}")
        raise ValueError(f"Erro ao processar DICOMDIR: {str(e)}")


def is_likely_dicom_by_content(file_path):
    try:
        with open(file_path, 'rb') as f:
            # Lê os primeiros bytes
            header = f.read(144)  # Header DICOM típico
            
            # Verifica magic numbers comuns do DICOM
            # DICOM files typically start with a 128-byte preamble followed by "DICM"
            if len(header) >= 132 and header[128:132] == b'DICM':
                logger.debug(f"Arquivo {file_path} tem assinatura DICM")
                return True
            
            # Alguns arquivos DICOM podem não ter o preamble
            # Verifica por patterns comuns nos primeiros bytes
            dicom_patterns = [
                b'\x08\x00',  # Group 0008 (common in DICOM)
                b'\x10\x00',  # Group 0010 (Patient info)
                b'\x20\x00',  # Group 0020 (Study info)
            ]
            
            for pattern in dicom_patterns:
                if pattern in header[:50]:
                    logger.debug(f"Arquivo {file_path} contém padrão DICOM {pattern}")
                    return True
                    
        return False
        
    except Exception as e:
        logger.debug(f"Erro ao verificar conteúdo binário de {file_path}: {str(e)}")
        return False

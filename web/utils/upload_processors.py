import os
import logging
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from web.utils.dicom_utils import is_dicom_file, convert_dicom_to_png_buffer, get_dicom_metadata
import tempfile
from django.conf import settings

logger = logging.getLogger(__name__)


def process_uploaded_image(uploaded_file, preserve_original_name=True):
    try:
        logger.info(f"Processando arquivo enviado: {uploaded_file.name}")
        
        # Salva temporariamente o arquivo original
        with tempfile.NamedTemporaryFile(delete=False, suffix='_temp') as temp_file:
            for chunk in uploaded_file.chunks():
                temp_file.write(chunk)
            temp_path = temp_file.name
        
        # Verifica se é DICOM
        if is_dicom_file(temp_path):
            logger.info(f"Arquivo identificado como DICOM: {uploaded_file.name}")
            
            try:
                # Extrai metadados
                metadata = get_dicom_metadata(temp_path)
                logger.info(f"Metadados extraídos: {metadata.get('modality', 'N/A')}")
                
                # Converte para PNG
                png_buffer = convert_dicom_to_png_buffer(temp_path)
                
                # Gera novo nome de arquivo
                if preserve_original_name:
                    base_name = os.path.splitext(uploaded_file.name)[0]
                    new_filename = f"{base_name}.png"
                else:
                    new_filename = f"converted_dicom_{uploaded_file.name}.png"
                
                # Cria novo arquivo Django
                processed_file = ContentFile(png_buffer.getvalue(), name=new_filename)
                
                # Adiciona informações sobre a conversão aos metadados
                metadata['converted_from_dicom'] = 'true'
                metadata['original_filename'] = uploaded_file.name
                metadata['converted_format'] = 'PNG'
                metadata['file_size_bytes'] = str(len(png_buffer.getvalue()))
                
                logger.info(f"Conversão DICOM concluída: {uploaded_file.name} -> {new_filename}")
                
                # Remove arquivo temporário
                os.unlink(temp_path)
                
                return processed_file, metadata
                
            except Exception as e:
                logger.error(f"Erro ao converter DICOM {uploaded_file.name}: {str(e)}")
                # Se falhar, retorna o arquivo original
                os.unlink(temp_path)
                return uploaded_file, {
                    'converted_from_dicom': 'false',
                    'original_filename': uploaded_file.name,
                    'conversion_error': str(e)
                }
        
        else:
            # Não é DICOM, retorna arquivo original
            logger.info(f"Arquivo não é DICOM, mantendo original: {uploaded_file.name}")
            os.unlink(temp_path)
            
            # Metadados básicos para arquivos não-DICOM
            metadata = {
                'converted_from_dicom': 'false',
                'original_filename': uploaded_file.name,
                'file_size_bytes': str(uploaded_file.size),
                'content_type': getattr(uploaded_file, 'content_type', 'unknown')
            }
            
            return uploaded_file, metadata
            
    except Exception as e:
        logger.error(f"Erro no processamento do arquivo {uploaded_file.name}: {str(e)}")
        
        # Em caso de erro geral, retorna arquivo original
        try:
            if 'temp_path' in locals():
                os.unlink(temp_path)
        except:
            pass
            
        return uploaded_file, {
            'converted_from_dicom': 'false',
            'original_filename': uploaded_file.name,
            'processing_error': str(e)
        }


def process_multiple_images(uploaded_files, file_prefix=""):
    """
    Processa múltiplas imagens enviadas.
    
    Args:
        uploaded_files: Lista de arquivos enviados
        file_prefix: Prefixo para os nomes dos arquivos processados
    
    Returns:
        list: Lista de tuplas (processed_file, metadata)
    """
    
    results = []
    
    for i, uploaded_file in enumerate(uploaded_files):
        try:
            # Adiciona numeração se houver prefixo
            if file_prefix:
                original_name = uploaded_file.name
                base_name, ext = os.path.splitext(original_name)
                uploaded_file.name = f"{file_prefix}_{i+1:03d}_{base_name}{ext}"
            
            processed_file, metadata = process_uploaded_image(uploaded_file)
            
            # Adiciona informações de lote aos metadados
            metadata['batch_index'] = str(i + 1)
            metadata['batch_total'] = str(len(uploaded_files))
            metadata['batch_prefix'] = file_prefix
            
            results.append((processed_file, metadata))
            
        except Exception as e:
            logger.error(f"Erro ao processar arquivo {i+1} do lote: {str(e)}")
            # Adiciona erro mas continua processando outros arquivos
            results.append((uploaded_file, {
                'converted_from_dicom': 'false',
                'original_filename': uploaded_file.name,
                'batch_processing_error': str(e),
                'batch_index': str(i + 1)
            }))
    
    logger.info(f"Processamento de lote concluído: {len(results)} arquivos processados")
    return results


def save_conversion_log(image_instance, metadata):
    try:
        # Se o modelo tiver um campo para metadados, salva lá
        if hasattr(image_instance, 'metadata'):
            image_instance.metadata = metadata
            image_instance.save()
        
        # Log das informações importantes
        if metadata.get('converted_from_dicom') == 'true':
            logger.info(
                f"Imagem {image_instance.id} convertida de DICOM - "
                f"Original: {metadata.get('original_filename')}, "
                f"Modalidade: {metadata.get('modality', 'N/A')}, "
                f"Tamanho: {metadata.get('file_size_bytes', 0)} bytes"
            )
    
    except Exception as e:
        logger.warning(f"Erro ao salvar log de conversão para {image_instance.id}: {str(e)}")


def get_conversion_settings():
    return {
        'output_format': 'PNG',  # PNG para máxima qualidade
        'compress_level': 1,     # Compressão mínima
        'preserve_metadata': True,
        'apply_window_level': True,
        'normalize_pixels': True,
        'convert_on_upload': True  # Flag principal
    }


def is_conversion_enabled():
    
    return getattr(settings, 'DICOM_AUTO_CONVERT_ON_UPLOAD', True)

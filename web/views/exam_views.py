from django.views import View
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import FileResponse, HttpResponse, Http404, JsonResponse
from web.models import Exam, XRay, Resonance, ImagesResonance, ImagesXRay
from web.utils.dicom_utils import is_dicom_file, dicom_to_image_response
from web.utils.dicom_viewer import (
    create_dicom_response, 
    get_dicom_metadata_response, 
    is_valid_dicom_image,
    get_dicom_window_presets
)
import os
import mimetypes


class RecordByExamIdRequest(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        id = request.GET.get("id")
        if not id:
            return HttpResponse("ID do exame é obrigatório", status=400)

        try:
            exam = Exam.objects.get(id=id)
            
            if not exam.record:
                raise Http404("Prontuário não encontrado.")
            
            if not os.path.exists(exam.record.path):
                raise Http404("Arquivo do prontuário não encontrado no servidor.")
        
            return FileResponse(
                exam.record.open('rb'), 
                as_attachment=True, 
                filename=os.path.basename(exam.record.name), 
                status=200
            )
        except Exam.DoesNotExist:
            raise Http404("Exame não encontrado.")
        except Exception as e:
            return HttpResponse("Erro interno do servidor", status=500)

    def post(self, request):
        id = request.POST.get("id")
        if not id:
            return HttpResponse(status=400)

        try:
            exam = Exam.objects.get(id=id)
            exam.record = request.FILES.get('prontuario')
            exam.save()
            return redirect('find-patients')
        except Exam.DoesNotExist:
            return HttpResponse(status=404)


class GetXRayListByPatient(LoginRequiredMixin, ListView):
    login_url = '/login/'
    redirect_field_name = 'next'
    model = XRay
    template_name = 'web/partials/imagens-raio-x.html'
    context_object_name = 'x_ray_list'

    def get_queryset(self):
        exam_id = self.request.GET.get('id')
        if not exam_id:
            return XRay.objects.none()
        try:
            exam = Exam.objects.get(id=exam_id)
            if exam.xray:
                return XRay.objects.filter(id=exam.xray.id)
            else:
                return XRay.objects.none()
        except Exam.DoesNotExist:
            return XRay.objects.none()


@login_required(login_url='/login/', redirect_field_name='next')
def get_ressonance_by_exam_id(request):
    exam_id = request.GET.get('id')
    if not exam_id:
        return HttpResponse(status=404)
    try:
        exam = Exam.objects.get(id=exam_id)
        if exam.resonance:
            images = ImagesResonance.objects.filter(resonance=exam.resonance)
            return render(request, 'web/partials/imagens-ressonancia.html', {"images": images}, status=200)
        else:
            return render(request, 'web/partials/imagens-ressonancia.html', {"images": []}, status=200)
    except Exam.DoesNotExist:
        return HttpResponse(status=404)


@login_required(login_url='/login/', redirect_field_name='next')
def serve_resonance_image(request, image_id):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Servindo imagem Ressonância ID: {image_id}")
        image = ImagesResonance.objects.get(id=image_id)
        
        if not image.image:
            logger.error(f"Imagem Ressonância {image_id} não tem arquivo associado")
            raise Http404("Imagem não encontrada.")
            
        image_path = image.image.path
        logger.info(f"Caminho da imagem: {image_path}")
        
        if not os.path.exists(image_path):
            logger.error(f"Arquivo não encontrado no caminho: {image_path}")
            raise Http404("Arquivo de imagem não encontrado no servidor.")
        
        # Verifica se é DICOM válido
        if is_valid_dicom_image(image_path):
            logger.info(f"Arquivo DICOM detectado, usando visualizador especializado: {image_path}")
            
            # Obtém parâmetros de visualização da query string
            window_center = request.GET.get('wc')  # window center
            window_width = request.GET.get('ww')   # window width
            auto_contrast = request.GET.get('auto_contrast', '').lower() == 'true'
            format_type = request.GET.get('format', 'PNG').upper()
            
            # Converte parâmetros para float se fornecidos
            if window_center:
                try:
                    window_center = float(window_center)
                except ValueError:
                    window_center = None
                    
            if window_width:
                try:
                    window_width = float(window_width)
                except ValueError:
                    window_width = None
            
            return create_dicom_response(
                image_path, 
                window_center=window_center,
                window_width=window_width,
                auto_contrast=auto_contrast,
                format=format_type
            )
        else:
            logger.info(f"Arquivo não-DICOM, servindo normalmente: {image_path}")
            # Para arquivos não-DICOM ou já convertidos
            mime_type, _ = mimetypes.guess_type(image_path)
            if not mime_type:
                if image_path.lower().endswith('.png'):
                    mime_type = 'image/png'
                else:
                    mime_type = 'application/octet-stream'
            
            return FileResponse(
                image.image.open('rb'),
                content_type=mime_type
            )
            
    except ImagesResonance.DoesNotExist:
        logger.error(f"ImagesResonance com ID {image_id} não existe")
        raise Http404("Imagem não encontrada.")
    except Exception as e:
        logger.error(f"Erro ao processar imagem Ressonância {image_id}: {str(e)}")
        # Fallback
        try:
            return FileResponse(
                image.image.open('rb'),
                content_type='application/octet-stream'
            )
        except Exception as fallback_error:
            logger.error(f"Erro no fallback para Ressonância {image_id}: {str(fallback_error)}")
            raise Http404("Erro ao processar imagem.")


@login_required(login_url='/login/', redirect_field_name='next')
def test_dicom_images(request):
    """
    View para testar e diagnosticar problemas com imagens DICOM
    Acesse via /exam/test-dicom/
    """
    import logging
    logger = logging.getLogger(__name__)
    
    results = {
        'xray_images': [],
        'resonance_images': [],
        'errors': []
    }
    
    try:
        # Testa imagens de Raio-X
        xray_images = ImagesXRay.objects.all()[:5]  # Limita a 5 para teste
        for img in xray_images:
            result = {
                'id': str(img.id),
                'file_path': img.image.path if img.image else 'N/A',
                'file_exists': False,
                'is_dicom': False,
                'error': None
            }
            
            try:
                if img.image and os.path.exists(img.image.path):
                    result['file_exists'] = True
                    result['is_dicom'] = is_dicom_file(img.image.path)
                    
                    if result['is_dicom']:
                        # Tenta extrair metadados
                        from web.utils.dicom_utils import get_dicom_metadata
                        metadata = get_dicom_metadata(img.image.path)
                        result['metadata'] = metadata
            except Exception as e:
                result['error'] = str(e)
            
            results['xray_images'].append(result)
        
        # Testa imagens de Ressonância
        resonance_images = ImagesResonance.objects.all()[:5]  # Limita a 5 para teste
        for img in resonance_images:
            result = {
                'id': str(img.id),
                'file_path': img.image.path if img.image else 'N/A',
                'file_exists': False,
                'is_dicom': False,
                'error': None
            }
            
            try:
                if img.image and os.path.exists(img.image.path):
                    result['file_exists'] = True
                    result['is_dicom'] = is_dicom_file(img.image.path)
                    
                    if result['is_dicom']:
                        # Tenta extrair metadados
                        from web.utils.dicom_utils import get_dicom_metadata
                        metadata = get_dicom_metadata(img.image.path)
                        result['metadata'] = metadata
            except Exception as e:
                result['error'] = str(e)
            
            results['resonance_images'].append(result)
            
    except Exception as e:
        results['errors'].append(str(e))
    
    # Retorna JSON para debug
    from django.http import JsonResponse
    return JsonResponse(results, json_dumps_params={'indent': 2})


@login_required(login_url='/login/', redirect_field_name='next')
def get_dicom_metadata(request, image_type, image_id):
    """
    Retorna metadados DICOM para uma imagem específica
    """
    try:
        if image_type == 'xray':
            image = ImagesXRay.objects.get(id=image_id)
        elif image_type == 'resonance':
            image = ImagesResonance.objects.get(id=image_id)
        else:
            return JsonResponse({'error': 'Tipo de imagem inválido'}, status=400)
        
        if not image.image or not os.path.exists(image.image.path):
            return JsonResponse({'error': 'Arquivo não encontrado'}, status=404)
        
        return get_dicom_metadata_response(image.image.path)
        
    except (ImagesXRay.DoesNotExist, ImagesResonance.DoesNotExist):
        return JsonResponse({'error': 'Imagem não encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required(login_url='/login/', redirect_field_name='next')
def get_window_presets(request, modality):
    """
    Retorna presets de window/level para uma modalidade específica
    """
    try:
        presets = get_dicom_window_presets(modality)
        return JsonResponse({
            'success': True,
            'modality': modality,
            'presets': presets
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@login_required(login_url='/login/', redirect_field_name='next')
def serve_xray_image(request, image_id):
    import logging
    logger = logging.getLogger(__name__)
    
    try:
        logger.info(f"Servindo imagem X-Ray ID: {image_id}")
        image = ImagesXRay.objects.get(id=image_id)
        
        if not image.image:
            logger.error(f"Imagem X-Ray {image_id} não tem arquivo associado")
            raise Http404("Imagem não encontrada.")
            
        image_path = image.image.path
        logger.info(f"Caminho da imagem: {image_path}")
        
        if not os.path.exists(image_path):
            logger.error(f"Arquivo não encontrado no caminho: {image_path}")
            raise Http404("Arquivo de imagem não encontrado no servidor.")
        
        # Verifica se é DICOM válido
        if is_valid_dicom_image(image_path):
            logger.info(f"Arquivo DICOM detectado, usando visualizador especializado: {image_path}")
            
            # Obtém parâmetros de visualização da query string
            window_center = request.GET.get('wc')  # window center
            window_width = request.GET.get('ww')   # window width
            auto_contrast = request.GET.get('auto_contrast', '').lower() == 'true'
            format_type = request.GET.get('format', 'PNG').upper()
            
            # Converte parâmetros para float se fornecidos
            if window_center:
                try:
                    window_center = float(window_center)
                except ValueError:
                    window_center = None
                    
            if window_width:
                try:
                    window_width = float(window_width)
                except ValueError:
                    window_width = None
            
            return create_dicom_response(
                image_path, 
                window_center=window_center,
                window_width=window_width,
                auto_contrast=auto_contrast,
                format=format_type
            )
        else:
            logger.info(f"Arquivo não-DICOM, servindo normalmente: {image_path}")
            # Para arquivos não-DICOM ou já convertidos
            mime_type, _ = mimetypes.guess_type(image_path)
            if not mime_type:
                if image_path.lower().endswith('.png'):
                    mime_type = 'image/png'
                else:
                    mime_type = 'application/octet-stream'
            
            return FileResponse(
                image.image.open('rb'),
                content_type=mime_type
            )
            
    except ImagesXRay.DoesNotExist:
        logger.error(f"ImagesXRay com ID {image_id} não existe")
        raise Http404("Imagem não encontrada.")
    except Exception as e:
        logger.error(f"Erro ao processar imagem X-Ray {image_id}: {str(e)}")
        # Fallback
        try:
            return FileResponse(
                image.image.open('rb'),
                content_type='application/octet-stream'
            )
        except Exception as fallback_error:
            logger.error(f"Erro no fallback para X-Ray {image_id}: {str(fallback_error)}")
            raise Http404("Erro ao processar imagem.")

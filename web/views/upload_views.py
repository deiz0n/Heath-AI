from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.db import transaction

from web.forms import (
    ImagesXRayForm, 
    ResonanceForm, 
    ResonanceImagesForm, 
    XRayForm
)
from web.models import ExamType,Exam, Clinician, Patient
from web.utils.upload_processors import process_multiple_images, save_conversion_log, is_conversion_enabled


from datetime import date

class UploadMultiModalRequestView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def post(self, request):
        files       = request.FILES
        cpf_patient = request.POST.get('patient')
        exam_kind   = request.POST.get('type-exam') 

        patient   = Patient.objects.get(cpf=cpf_patient)
        clinician = Clinician.objects.get(email=request.user.email)

        exam_type_map = {
            'x-ray':      ExamType._2D,
            'resonance':  ExamType._3D,
            'both':       ExamType._2D,
        }
        exam_type = exam_type_map.get(exam_kind)

        with transaction.atomic():

            if exam_kind in ('x-ray','both'):
                xray_form = XRayForm(request.POST, request.FILES)
                if not xray_form.is_valid():
                    return render(request, 'web/pages/pagina-inicial.html', {
                        'success': False,
                        'errors_xray': xray_form.errors
                    }, status=400)

                xray = xray_form.save(commit=False)
                xray.save()

                # Processa imagens de X-Ray com conversão DICOM automática
                xray_files = files.getlist('images_xray')
                
                if is_conversion_enabled():
                    processed_results = process_multiple_images(xray_files, "xray")
                    
                    imgs_xray = []
                    for processed_file, metadata in processed_results:
                        img_obj = ImagesXRayForm(
                            {'xray': xray.id},
                            {'image': processed_file}
                        ).save(commit=False)
                        imgs_xray.append(img_obj)
                        
                    
                    ImagesXRayForm.Meta.model.objects.bulk_create(imgs_xray)
                    
                else:

                    imgs_xray = []
                    for f in xray_files:  
                        imgs_xray.append(
                            ImagesXRayForm(
                                {'xray': xray.id},
                                {'image': f}
                            ).save(commit=False)
                        )
                    ImagesXRayForm.Meta.model.objects.bulk_create(imgs_xray)

            if exam_kind in ('resonance','both'):
                res_form = ResonanceForm(request.POST, request.FILES)
                if not res_form.is_valid():
                    return render(request, 'web/pages/pagina-inicial.html', {
                        'success': False,
                        'errors_resonance': res_form.errors
                    }, status=400)

                resonance = res_form.save(commit=False)
                resonance.save()

                # Processa imagens de Ressonância com conversão DICOM automática
                resonance_files = files.getlist('images_resonance')
                
                if is_conversion_enabled():
                    processed_results = process_multiple_images(resonance_files, "resonance")
                    
                    imgs_res = []
                    for processed_file, metadata in processed_results:
                        img_obj = ResonanceImagesForm(
                            {'resonance': resonance.id},
                            {'image': processed_file}
                        ).save(commit=False)
                        imgs_res.append(img_obj)
                        
                        # Log da conversão se houver
                    
                    ResonanceImagesForm.Meta.model.objects.bulk_create(imgs_res)
                    
                    # Salva logs de conversão para todas as imagens
                    for img_obj, (_, metadata) in zip(imgs_res, processed_results):
                        save_conversion_log(img_obj, metadata)
                        
                else:
                    # Processamento original sem conversão
                    imgs_res = []
                    for f in resonance_files:
                        imgs_res.append(
                            ResonanceImagesForm(
                                {'resonance': resonance.id},
                                {'image': f}
                            ).save(commit=False)
                        )
                    ResonanceImagesForm.Meta.model.objects.bulk_create(imgs_res)

            exam = Exam(
                type      = exam_type,
                patient   = patient,
                clinician = clinician,
                xray      = locals().get('xray', None),
                resonance = locals().get('resonance', None),
                record    = request.FILES.get('record')
            )
            exam.save()

        return render(request, 'web/pages/pagina-inicial.html', {'success': True}, status=201)
    
    def get(self, request):
        return redirect('home')

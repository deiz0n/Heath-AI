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

                imgs_xray = []
                for f in files.getlist('images_xray'):  
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

                imgs_res = []
                for f in files.getlist('images_resonance'):
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

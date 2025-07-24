from django.views import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import render
from web.models import XRay, Resonance, ImagesResonance, Exam, Clinician, Patient


class UploadMultiModalRequestView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def post(self, request):
        files = request.FILES
        cpf_patient = request.POST.get('patient')
        patient = Patient.objects.get(cpf=cpf_patient)
        clinician = Clinician.objects.get(email=request.user.email)

        if 'ambos_img_pd_cima' in files and 'ambos_ressonancia' in files:
            x_ray = XRay.objects.create(
                img_pd_cima=files.get('ambos_img_pd_cima'),
                img_pd_lateral=files.get('ambos_img_pd_lateral'),
                img_pe_cima=files.get('ambos_img_pe_cima'),
                img_pe_lateral=files.get('ambos_img_pe_lateral'),
                img_ambos_cima=files.get('ambos_img_ambos_cima')
            )
            resonance = Resonance.objects.create()
            images = [ImagesResonance(ressonancia=resonance, imagem=img) for img in files.getlist('ambos_ressonancia')]
            ImagesResonance.objects.bulk_create(images)
            Exam.objects.create(x_ray=x_ray, resonance=resonance, record=files.get('prontuario'), clinician=clinician, patient=patient)
            return render(request, 'web/pages/pagina-inicial.html', {'success': True}, status=201)

        if 'raio_x_img_pd_cima' in files:
            XRay.objects.create(
                img_pd_cima=files.get('raio_x_img_pd_cima'),
                img_pd_lateral=files.get('raio_x_img_pd_lateral'),
                img_pe_cima=files.get('raio_x_img_pe_cima'),
                img_pe_lateral=files.get('raio_x_img_pe_lateral'),
                img_ambos_cima=files.get('raio_x_img_ambos_cima'),
                prontuario=files.get('prontuario')
            )
            return render(request, 'web/pages/pagina-inicial.html', {'success': True}, status=201)

        if 'imagens_ressonancia' in files:
            resonance = Resonance.objects.create()
            images = [ImagesResonance(ressonancia=resonance, imagem=img) for img in files.getlist('imagens_ressonancia')]
            ImagesResonance.objects.bulk_create(images)
            resonance.record = files.get('prontuario')
            resonance.save()
            return render(request, 'web/pages/pagina-inicial.html', {'success': True}, status=201)

        return render(request, 'web/pages/pagina-inicial.html', {'success': False}, status=400)

    def get(self, request):
        return render(request, 'web/pages/pagina-inicial.html', status=200)

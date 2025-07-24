from django.views import View
from django.views.generic import ListView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.http import FileResponse, HttpResponse, Http404
from web.models import Exam, XRay, Resonance


class RecordByExamIdRequest(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        id = request.GET.get("id")
        if not id:
            return HttpResponse(status=400)

        try:
            exam = Exam.objects.get(id=id)
            if not exam.record:
                raise Http404("Prontuário não encontrado.")
            return FileResponse(exam.record.open('rb'), as_attachment=True, filename=exam.record.name, status=200)
        except Exam.DoesNotExist:
            raise Http404("Exame não encontrado.")

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
            return XRay.objects.filter(id=exam.xray.id) if exam.xray else XRay.objects.none()
        except Exam.DoesNotExist:
            return XRay.objects.none()


@login_required(login_url='/login/', redirect_field_name='next')
def get_ressonance_by_exam_id(request):
    id = request.GET.get('id')
    if not id:
        return HttpResponse(status=404)
    try:
        model = Resonance.objects.get(id=id)
        return render(request, 'web/partials/imagens-ressonancia.html', {"resonance": model}, status=200)
    except Resonance.DoesNotExist:
        return HttpResponse(status=404)

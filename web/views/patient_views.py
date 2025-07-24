from django.views import View
from django.http import HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from web.forms import PatientForm


class FindPatientsRequest(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        # lógica comentada no original
        return HttpResponse(status=204)


class FindPatientsByExamDate(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        return HttpResponse(status=204)


class RegisterPatient(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def post(self, request):
        form = PatientForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse(status=201)
        return HttpResponse(status=400)

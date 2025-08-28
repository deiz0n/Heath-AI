from django.views import View
from django.http import HttpResponse
from django.contrib.auth.mixins import LoginRequiredMixin
from web.forms import PatientForm
from django.shortcuts import render
from web.models import Exam

from datetime import datetime

from django.shortcuts import render
from web.models import Patient, Exam
from django.db.models import Q
from datetime import datetime

class FindPatientsRequest(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        query = request.GET.get('patient', '').strip()
    
        if not query:
            patients = Patient.objects.filter(exams__isnull=False).distinct()
        else:
            clean_cpf = ''.join(filter(str.isdigit, query))
            
            if query.isdigit() or clean_cpf:
                patients = Patient.objects.filter(
                    Q(first_name__icontains=query) |
                    Q(last_name__icontains=query) |
                    Q(cpf__icontains=query) |
                    Q(cpf__icontains=clean_cpf) |  # Busca pelo CPF sem formatação
                    (Q(first_name__icontains=query.split()[0]) if ' ' in query else Q())
                )
            else:
                patients = Patient.objects.filter(
                    Q(first_name__icontains=query) |
                    Q(last_name__icontains=query) |
                    Q(cpf__icontains=query) |
                    (Q(first_name__icontains=query.split()[0]) if ' ' in query else Q())
                )

        exams = Exam.objects.filter(patient__in=patients).select_related('patient', 'clinician', 'xray', 'resonance').order_by('-created_at')

        seen_patients = set()
        unique_exams = []
        for exam in exams:
            patient_id = exam.patient.id
            if patient_id not in seen_patients:
                unique_exams.append(exam)
                seen_patients.add(patient_id)

        result = []
        for exam in unique_exams:
            result.append({
                'patient': {
                    'name': f"{exam.patient.first_name} {exam.patient.last_name}",
                    'cpf': exam.patient.cpf,
                    'age': (datetime.now().date() - exam.patient.birthday).days // 365,
                    'address': exam.patient.address,
                },
                'clinician': {
                    'name': f"{exam.clinician.first_name} {exam.clinician.last_name}",
                    'crm': exam.clinician.crm,
                },
                'exam': {
                    'date': exam.created_at.strftime('%Y-%m-%d'),
                    'id': str(exam.id),
                    'record': exam.record.url if exam.record else '',
                    'resonance': bool(exam.resonance),
                    'x_ray': bool(exam.xray),
                }
            })

        return render(request, 'web/partials/main-dashboard-patients.html', {'result': result})


class FindPatientsByExamDate(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        from datetime import timedelta
        date_str = request.GET.get('date')
        range_str = request.GET.get('range')
        exams = Exam.objects.none()

        if range_str:
            today = datetime.now().date()
            if range_str == 'last-1-month':
                start_date = today - timedelta(days=30)
            elif range_str == 'last-15-days':
                start_date = today - timedelta(days=15)
            elif range_str == 'last-7-days':
                start_date = today - timedelta(days=7)
            else:
                return HttpResponse('Invalid range parameter.', status=400)
            exams = Exam.objects.filter(created_at__date__gte=start_date, created_at__date__lte=today)
        elif date_str:
            try:
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return HttpResponse('Invalid date format. Use YYYY-MM-DD.', status=400)
            exams = Exam.objects.filter(created_at__date=date)
        else:
            return HttpResponse('Missing date or range parameter', status=400)

        exams = exams.select_related('patient', 'clinician', 'xray', 'resonance').order_by('-created_at')
        
        seen_patients = set()
        unique_exams = []
        for exam in exams:
            patient_id = exam.patient.id
            if patient_id not in seen_patients:
                unique_exams.append(exam)
                seen_patients.add(patient_id)

        result = []
        for exam in unique_exams:
            result.append({
                'patient': {
                    'name': f"{exam.patient.first_name} {exam.patient.last_name}",
                    'cpf': exam.patient.cpf,
                    'age': (datetime.now().date() - exam.patient.birthday).days // 365,
                    'address': exam.patient.address,
                },
                'clinician': {
                    'name': f"{exam.clinician.first_name} {exam.clinician.last_name}",
                    'crm': exam.clinician.crm,
                },
                'exam': {
                    'date': exam.created_at.strftime('%Y-%m-%d'),
                    'id': str(exam.id),
                    'record': exam.record.url if exam.record else '',
                    'resonance': bool(exam.resonance),
                    'x_ray': bool(exam.xray),
                }
            })

        return render(request, 'web/partials/main-dashboard-patients.html', {'result': result})


class RegisterPatient(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def post(self, request):
        form = PatientForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponse(status=201)
        return HttpResponse(status=400)

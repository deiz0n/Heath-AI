from cpf_field.validators import validate_cpf

from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.http import HttpResponse
from django.views import View
from django.db.models import Q
from django.http import FileResponse, Http404

from .models import RaioX, Ressonancia, ImagensRessonancia, MultiModal, Clinico, Paciente
from .forms import ClinicianForm

from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

@login_required(login_url='/login/', redirect_field_name='next')
def render_home(request):
    if request.headers.get('Hx-Request') == 'true':
        return render(
            request,
            'web/partials/main.html',
            status=200
        )
    return render(
        request,
        'web/pages/pagina-inicial.html',
        status=200
    )

def render_login(request):
    return render(
        request,
        'web/pages/login.html',
        status=200
    )

def logout_view(request):
    logout(request)
    response = HttpResponse(status=204)
    response['HX-Redirect'] = '/auth'
    return response

def render_create_user(request):
    return render(
        request,
        'web/pages/cadastro-usuario.html',
        status=200
    )

@login_required(login_url='/login/', redirect_field_name='next')
def render_dashboard(request):
    if request.headers.get('Hx-Request') == 'true':
        return render(
            request,
            'web/partials/main-dashboard.html',
            status=200
        )
    return render(
        request,
        'web/pages/dashboard.html',
        status=200
    )

class CreateUserView(View):
    def post(self, request):
        response = self.validate_user(request)
        if response:
            return response

        form = ClinicianForm(request.POST)

        if form.is_valid():
            clinician = form.save(commit=False)
            clinician.senha = make_password(request.POST.get('senha_cadastro'))
            clinician.save()

            User.objects.create_user(
                username=clinician.email,
                password=request.POST.get('senha_cadastro'),
                email=clinician.email
            )

            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                context={
                    "msg_sucesso": True,
                    "mensagem": 'Cadastro realizado com sucesso!'
                },
                status=201
            )
        else:
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': request.POST},
                status=400
            )

    def get(self, request):
        return redirect('cadastro_usuario')

    def validate_user(self, request):
        data = request.POST
        if Clinico.objects.filter(crm=data.get('crm')).exists():
            messages.error(
                request=request,
                message='Este CRM já está sendo utilizado',
                extra_tags='crm-existente'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        if Clinico.objects.filter(cpf=data.get('cpf')).exists():
            messages.error(
                request=request,
                message='Este CPF já está sendo utilizado',
                extra_tags='cpf-existente'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        try:
            validate_cpf(data.get('cpf'))
        except:
            messages.error(
                request=request,
                message='CPF inválido',
                extra_tags='cpf-invalido'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        if Clinico.objects.filter(email=data.get('email')).exists():
            messages.error(
                request=request,
                message='Este email já está sendo utilizado',
                extra_tags='email-existente'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        if data.get('email') != data.get('confirmar_email'):
            messages.error(
                request=request,
                message='Os emails não coincidem',
                extra_tags='email-nao-coincidem'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        if data.get('senha_cadastro') != data.get('confirmar_senha'):
            messages.error(
                request=request,
                message='As senhas não coincidem',
                extra_tags='senhas-nao-coincidem'
            )
            return render(
                request,
                'web/partials/main-cadastro-usuario.html',
                {'form_data': data},
                status=400
            )

        return None

class LoginRequestView(View):
    def post(self, request):
        data = request.POST

        email = data.get('email')
        password = data.get('senha')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            response = HttpResponse()
            response['HX-Redirect'] = '/home/'
            return response
        else:
            messages.error(
                request=request,
                message='Credenciais inválidas. Tente novamente'
            )
            return render(
                request,
                'web/partials/main-login.html',
                status=400
            )

    def get(self, request):
        return render(
            request,
            'web/pages/login.html',
            status=200
        )

class UploadMultiModalRequestView(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def post(self, request):
        files = request.FILES

        user = request.user
        clinician = Clinico.objects.get(email=user.email)

        if 'ambos_img_pd_cima' in files and 'ambos_ressonancia' in files:
            x_ray = RaioX.objects.create(
                img_pd_cima=files.get('ambos_img_pd_cima'),
                img_pd_lateral=files.get('ambos_img_pd_lateral'),
                img_pe_cima=files.get('ambos_img_pe_cima'),
                img_pe_lateral=files.get('ambos_img_pe_lateral'),
                img_ambos_cima=files.get('ambos_img_ambos_cima')
            )

            resonance = Ressonancia.objects.create()

            images = [
                ImagensRessonancia(ressonancia=resonance, imagem=image)
                for image in files.getlist('ambos_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(images)

            MultiModal.objects.create(
                raio_x=x_ray,
                ressonancia=resonance,
                prontuario=files.get('prontuario'),
                clinico=clinician
            )

            return render(
                request,
                'web/pages/pagina-inicial.html',
                {'success': True},
                status=201
            )

        if 'raio_x_img_pd_cima' in files:
            x_ray = RaioX.objects.create(
                img_pd_cima=files.get('raio_x_img_pd_cima'),
                img_pd_lateral=files.get('raio_x_img_pd_lateral'),
                img_pe_cima=files.get('raio_x_img_pe_cima'),
                img_pe_lateral=files.get('raio_x_img_pe_lateral'),
                img_ambos_cima=files.get('raio_x_img_ambos_cima'),
                prontuario=files.get('prontuario')
            )

            x_ray.save()

            return render(
                request,
                'web/pages/pagina-inicial.html',
                {'success': True},
                status=201
            )

        if 'imagens_ressonancia' in files:
            resonance = Ressonancia.objects.create()

            images = [
                ImagensRessonancia(ressonancia=resonance, imagem=image)
                for image in files.getlist('imagens_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(images)

            if 'prontuario' in files:
                resonance.prontuario = files['prontuario']

            resonance.save()

            return render(
                request,
                'web/pages/pagina-inicial.html',
                {'success': True},
                status=201
            )
        return render(
            request,
            'web/pages/pagina-inicial.html',
            {'sucess': False},
            status=400
        )

    def get(self, request):
        return render(
            request,
            'web/pages/pagina-inicial.html',
            status=200
        )

class FindPatientsRequest(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        field_patient = request.GET.get('patient', '')
        result_query = []

        if not field_patient:
            patients = []
        else:
            patients = (
                Paciente.objects
                .filter(Q(nome__icontains=field_patient) | Q(cpf__icontains=field_patient))
                .prefetch_related(
                    'exame__clinico'
                )
            )

        for patient in patients:
            for exam in patient.exame.all():
                result_query.append({
                    "patient": {
                        "id": patient.id,
                        "name": f"{patient.nome} {patient.sobrenome}",
                        "cpf": patient.cpf,
                        "age": to_age(patient.data_nascimento),
                        "address": patient.endereco
                    },
                    "clinician": {
                        "id": exam.clinico.id,
                        "name": f"{exam.clinico.nome} {exam.clinico.sobrenome}",
                        "crm": exam.clinico.crm,
                    },
                    "exam": {
                        "id": exam.id,
                        "date": exam.data.strftime('%d/%m/%Y'),
                        "x_ray": exam.raio_x.id if exam.raio_x else None,
                        "resonance": exam.raio_x.id if exam.raio_x else None,
                        "record": exam.prontuario if exam.prontuario else None
                    }
                })

        return render(
            request,
            'web/partials/main-dashboard-patients.html',
            {'result': result_query},
            status=200
        )

class FindPatientsByExamDate(LoginRequiredMixin, View):
    login_url = '/login/'
    redirect_field_name = 'next'

    def get(self, request):
        today = date.today()
        date_start = None
        result_query = []

        if request.GET.get('last-7-days'):
            date_start = today - timedelta(days=7)
        elif request.GET.get('last-15-days'):
            date_start = today - timedelta(days=15)
        elif request.GET.get('last-1-month'):
            date_start = today - relativedelta(months=1)

        if date_start:
            patients = Paciente.objects.filter(
                exame__data__date__range=(date_start, today)
            ).distinct()
        else:
            return None

        for patient in patients:
            exams = patient.exame.filter(data__date__range=(date_start, today))
            for exam in exams:
                result_query.append({
                    "patient": {
                        "id": patient.id,
                        "name": f"{patient.nome} {patient.sobrenome}",
                        "cpf": patient.cpf,
                        "age": to_age(patient.data_nascimento),
                        "address": patient.endereco
                    },
                    "clinician": {
                        "id": exam.clinico.id,
                        "name": f"{exam.clinico.nome} {exam.clinico.sobrenome}",
                        "crm": exam.clinico.crm,
                    },
                    "exam": {
                        "id": exam.id,
                        "date": exam.data.strftime('%d/%m/%Y'),
                        "x_ray": exam.raio_x.id if exam.raio_x else None,
                        "resonance": exam.raio_x.id if exam.raio_x else None,
                        "record": exam.prontuario if exam.prontuario else None
                    }
                })

        return render(
            request,
            'web/partials/main-dashboard-patients.html',
            {'result': result_query},
            status=200
        )

@login_required(login_url='/login/', redirect_field_name='next')
def get_record_by_exam_id(self, id):
    try:
        multimodal = MultiModal.objects.get(id=id)
        prontuario = multimodal.prontuario
        if not prontuario:
            raise Http404("Prontuário não encontrado.")
        return FileResponse(prontuario.open('rb'), as_attachment=True, filename=prontuario.name)
    except MultiModal.DoesNotExist:
        raise Http404("Exame não encontrado.")


def to_age(data) -> int:
    if not data:
        return -1
    today = date.today()
    return today.year - data.year - ((today.month, today.day) < (data.month, data.day))
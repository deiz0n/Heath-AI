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

from .models import RaioX, Ressonancia, ImagensRessonancia, MultiModal, Clinico
from .forms import ClinicianForm

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
            response['HX-Redirect'] = '/pagina-inicial/'
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
        return render(request, 'web/pages/login.html')

class UploadMultiModalRequest(LoginRequiredMixin, View):
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
        return render(request, 'web/pages/pagina-inicial.html')

@login_required
def pagina_inicial(request):
    return render(request, 'web/pages/pagina-inicial.html')

def logout_view(request):
    logout(request)
    response = HttpResponse()
    response['HX-Redirect'] = '/'
    return response

def login_view(request):
    return render(request, 'web/pages/login.html')

def cadastro_usuario(request):
    return render(request, 'web/pages/cadastro-usuario.html')
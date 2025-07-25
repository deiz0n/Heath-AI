from django.views import View
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User

from cpf_field.validators import validate_cpf

from web.forms import ClinicianForm
from web.models import Clinician

class LoginRequestView(View):
    def post(self, request):
        user = authenticate(request, username=request.POST['email'], password=request.POST['senha'])
        if user:
            login(request, user)
            response = HttpResponse()
            response['HX-Redirect'] = '/home/'
            return response
        messages.error(request, 'Credenciais inválidas.')
        return render(request, 'web/partials/main-login.html', status=400)

    def get(self, request):
        return render(request, 'web/pages/login.html')


def logout_view(request):
    logout(request)
    response = HttpResponse(status=204)
    response['HX-Redirect'] = '/auth'
    return response


def render_login(request):
    return render(request, 'web/pages/login.html', {"title_page": 'Login'})


def render_create_user(request):
    return render(request, 'web/pages/cadastro-usuario.html', {'title_page': 'Cadastro'})


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

            return render(request, 'web/partials/main-cadastro-usuario.html', {
                "msg_sucesso": True,
                "mensagem": 'Cadastro realizado com sucesso!'
            }, status=201)

        return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': request.POST}, status=400)

    def get(self, request):
        return redirect('register_user')

    def validate_user(self, request):
        data = request.POST

        if Clinician.objects.filter(crm=data.get('crm')).exists():
            messages.error(request, 'Este CRM já está sendo utilizado', extra_tags='crm-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        if Clinician.objects.filter(cpf=data.get('cpf')).exists():
            messages.error(request, 'Este CPF já está sendo utilizado', extra_tags='cpf-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        try:
            validate_cpf(data.get('cpf'))
        except:
            messages.error(request, 'CPF inválido', extra_tags='cpf-invalido')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        if Clinician.objects.filter(email=data.get('email')).exists():
            messages.error(request, 'Este email já está sendo utilizado', extra_tags='email-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        if data.get('email') != data.get('confirmar_email'):
            messages.error(request, 'Os emails não coincidem', extra_tags='email-nao-coincidem')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        if data.get('senha_cadastro') != data.get('confirmar_senha'):
            messages.error(request, 'As senhas não coincidem', extra_tags='senhas-nao-coincidem')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': data}, status=400)

        return None

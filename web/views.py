from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponse

from .models import RaioX, Ressonancia, ImagensRessonancia, MultiModal, Clinico

def criar_usuario(request):
    if request.method == 'POST':    
        form_data = request.POST

        if Clinico.objects.filter(crm=form_data.get('crm')).exists():
            messages.error(request=request, message='Este CRM já está sendo utilizado', extra_tags='crm-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': form_data})

        if Clinico.objects.filter(cpf=form_data.get('cpf')).exists():
            messages.error(request=request, message='Este CPF já está sendo utilizado', extra_tags='cpf-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': form_data})

        if Clinico.objects.filter(email=form_data.get('email')).exists():
            messages.error(request=request, message='Este email já está sendo utilizado', extra_tags='email-existente')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': form_data})

        if form_data.get('email') != form_data.get('confirmar_email'):
            messages.error(request=request, message='Os emails não coincidem', extra_tags='email-nao-coincidem')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': form_data})

        if form_data.get('senha_cadastro') != form_data.get('confirmar_senha'):
            messages.error(request=request, message='As senhas não coincidem', extra_tags='senhas-nao-coincidem')
            return render(request, 'web/partials/main-cadastro-usuario.html', {'form_data': form_data})

        clinico = Clinico.objects.create(
            nome=form_data.get('nome'),
            sobrenome=form_data.get('sobrenome'),
            cpf=form_data.get('cpf'),
            crm=form_data.get('crm'),
            data_aniversario=form_data.get('data_aniversario'),
            email=form_data.get('confirmar_email'),
            senha=make_password(form_data.get('confirmar_senha'))
        )
            
        user = User.objects.create_user(
            username=clinico.email,
            password=form_data.get('confirmar_senha'),
            email=clinico.email
        )
                    
        clinico.save()
        return render(
            request,
            'web/partials/main-cadastro-usuario.html',
            context={
              "msg_sucesso": True,
              "mensagem": 'Cadastro realizado com sucesso!'
            }
        )
    else:
        return redirect('cadastro_usuario')
    

def iniciar_sessao(request):
    if request.method == "POST":
        email = request.POST.get("email")
        senha = request.POST.get("senha")

        print(f'Email: {email} | Senha: {senha}')

        usuario = authenticate(request, username=email, password=senha)
        print(str(usuario))

        if usuario is not None:
            login(request, usuario)
            response = HttpResponse()
            response['HX-Redirect'] = '/pagina-inicial/'
            return response
        else:
            messages.error(request=request, message='Credenciais inválidas. Tente novamente')
            return render(request, 'web/partials/main-login.html')

    return render(request, 'web/pages/login.html')

@login_required
def upload_multi_modal(request):
    if request.method == "POST":
        files = request.FILES

        usuario = request.user
        clinico = Clinico.objects.get(email=usuario.email)

        if 'ambos_img_pd_cima' in files and 'ambos_ressonancia' in files:
            novo_raiox = RaioX.objects.create(
                img_pd_cima=files.get('ambos_img_pd_cima'),
                img_pd_lateral=files.get('ambos_img_pd_lateral'),
                img_pe_cima=files.get('ambos_img_pe_cima'),
                img_pe_lateral=files.get('ambos_img_pe_lateral'),
                img_ambos_cima=files.get('ambos_img_ambos_cima')
            )

            ressonancia = Ressonancia.objects.create()
            imagens = [
                ImagensRessonancia(ressonancia=ressonancia, imagem=imagem)
                for imagem in files.getlist('ambos_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(imagens)

            novo_multimodal = MultiModal.objects.create(
                raio_x=novo_raiox,
                ressonancia=ressonancia,
                prontuario=files.get('prontuario'),
                clinico=clinico
            )

        if 'raio_x_img_pd_cima' in files:
            raio_x = RaioX.objects.create(
                img_pd_cima=files.get('raio_x_img_pd_cima'),
                img_pd_lateral=files.get('raio_x_img_pd_lateral'),
                img_pe_cima=files.get('raio_x_img_pe_cima'),
                img_pe_lateral=files.get('raio_x_img_pe_lateral'),
                img_ambos_cima=files.get('raio_x_img_ambos_cima'),
                prontuario=files.get('prontuario')
            )

            raio_x.save()

        if 'imagens_ressonancia' in files:
            ressonancia = Ressonancia.objects.create()

            images = [
                ImagensRessonancia(ressonancia=ressonancia, imagem=image)
                for image in files.getlist('imagens_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(images)

            if 'prontuario' in files:
                ressonancia.prontuario = files['prontuario']

            ressonancia.save()

            return render(request, 'web/pages/pagina-inicial.html', {'success': True})
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
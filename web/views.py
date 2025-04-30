from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

from .models import RaioX, Ressonancia, ImagensRessonancia, MultiModal, Clinico

def criar_usuario(request):
    try:
        if request.method == 'POST':    
            clinico = Clinico.objects.create(
                nome=request.POST.get('nome'),
                sobrenome=request.POST.get('sobrenome'),
                cpf=request.POST.get('cpf'),
                crm=request.POST.get('crm'),
                data_aniversario=request.POST.get('data_aniversario'),
                email=request.POST.get('email'),
                senha=make_password(request.POST.get('senha'))
            )
            
            user = User.objects.create_user(
                username=clinico.email,
                password=request.POST.get('senha-cadastro'),
                email=clinico.email
            )
                        
            clinico.save()
            return redirect('login')
        else:
            return redirect('login')    
        
    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")
        return render(request, 'web/pages/login.html')
    

def iniciar_sessao(request):
    try:
        if request.method == "POST":
            username = request.POST.get("email")
            password = request.POST.get("senha")
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                return redirect('login') 
            
        return redirect('login')
    
    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")
        return render(request, 'web/pages/login.html')

    
        
@login_required
def upload_raio_x(request):
    
    try:
        files = request.FILES
        
        if 'raio_x_img_pd_cima' in files:
            novo_raiox = RaioX()

            novo_raiox.img_pd_cima = files['raio_x_img_pd_cima']
            novo_raiox.img_pd_lateral = files['raio_x_img_pd_lateral']
            novo_raiox.img_pe_cima = files['raio_x_img_pe_cima']
            novo_raiox.img_pe_lateral = files['raio_x_img_pe_lateral']
            novo_raiox.img_ambos_cima = files['raio_x_img_ambos_cima']
                
            if 'prontuario' in files:
                novo_raiox.prontuario = files['prontuario']

            novo_raiox.save()
            
            return render(request, 'web/pages/pagina-inicial.html')

    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")
        return render(request, 'web/pages/pagina-inicial.html')

@login_required
def upload_ressonancia(request):
    try:
        files = request.FILES

        if 'imagens_ressonancia' in files:
            nova_ressonancia = Ressonancia.objects.create()

            imagens = [
                ImagensRessonancia(ressonancia=nova_ressonancia, imagem=imagem)
                for imagem in files.getlist('imagens_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(imagens)

            if 'prontuario' in files:
                nova_ressonancia.prontuario = files['prontuario']
                nova_ressonancia.save()

            return render(request, 'web/pages/pagina-inicial.html')

    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}") 
        return render(request, 'web/pages/pagina-inicial.html')

@login_required
def upload_multi_modal(request):
    try:
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

            nova_ressonancia = Ressonancia.objects.create()
            imagens = [
                ImagensRessonancia(ressonancia=nova_ressonancia, imagem=imagem)
                for imagem in files.getlist('ambos_ressonancia')
            ]
            ImagensRessonancia.objects.bulk_create(imagens)

            novo_multimodal = MultiModal.objects.create(
                raio_x=novo_raiox,
                ressonancia=nova_ressonancia,
                prontuario=files.get('prontuario'),
                clinico=clinico
            )

            return render(request, 'web/pages/pagina-inicial.html', {'success': True})

    except Exception as e:
        print(f"Erro ao salvar multimodal: {str(e)}")
        return render(request, 'web/pages/pagina-inicial.html', {'error': str(e)})

@login_required
def pagina_inicial(request):
    return render(request, 'web/pages/pagina-inicial.html')

def login_view(request):
    return render(request, 'web/pages/login.html')

def cadastro_usuario(request):
    return render(request, 'web/pages/cadastro-usuario.html')
from django.shortcuts import render, redirect

from .models import RaioX, Ressonancia, ImagensRessonancia, MultiModal

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


def upload_multi_modal(request):
    try:
        files = request.FILES

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
                prontuario=files.get('prontuario')
            )

            return render(request, 'web/pages/pagina-inicial.html', {'success': True})

    except Exception as e:
        print(f"Erro ao salvar multimodal: {str(e)}")
        return render(request, 'web/pages/pagina-inicial.html', {'error': str(e)})

def pagina_inicial(request):
    return render(request, 'web/pages/pagina-inicial.html')
from django.shortcuts import render, redirect

from .models import RaioX

def upload_raio_x(request):
    
    try:
        files = request.FILES
        
        if'raio_x_img_pd_cima' in files:
            novo_raiox = RaioX()

            novo_raiox.img_pd_cima = files['raio_x_img_pd_cima']
            novo_raiox.img_pd_lateral = files['raio_x_img_pd_lateral']
            novo_raiox.img_pe_cima = files['raio_x_img_pe_cima']
            novo_raiox.img_pe_lateral = files['raio_x_img_pe_lateral']
            novo_raiox.img_ambos_cima = files['raio_x_img_ambos_cima']
                
            if 'prontuario' in files:
                novo_raiox.prontuario = files['prontuario']

            novo_raiox.save()
            
            return redirect('home')

    except Exception as e:
        print(f"Erro ao processar formulário: {str(e)}")  # Para depuração
        return render(request, 'web/pages/pagina-inicial.html')


def pagina_inicial(request):
    return render(request, 'web/pages/pagina-inicial.html')
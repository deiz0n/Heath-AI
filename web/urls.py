from django.urls import path

from .views import pagina_inicial, upload_raio_x, upload_ressonancia, upload_multi_modal, login_view, cadastro_usuario, criar_usuario, iniciar_sessao

urlpatterns = [
    path('', login_view, name='login'),
    path('pagina-inicial/', pagina_inicial, name='home'),
    path('criar-usuario/', criar_usuario, name='criar-usuario'),
    path('cadastro-usuario/', cadastro_usuario, name='cadastro_usuario'),
    path('iniciar-sessao/', iniciar_sessao, name='iniciar-sessao'),
    path('upload-raiox/', upload_raio_x, name='upload-raiox'),
    path('upload-ressonancia/', upload_ressonancia, name='upload-ressonancia'),
    path('upload-multi-modal/', upload_multi_modal, name='upload-multi-modal')
]
from django.urls import path

from .views import pagina_inicial, upload_multi_modal, login_view, cadastro_usuario, iniciar_sessao, logout_view, CreateUserView

urlpatterns = [
    path('', login_view, name='login'),
    path('pagina-inicial/', pagina_inicial, name='home'),
    path(
        'create_user/',
        view=CreateUserView.as_view(),
        name='create_user'
    ),
    path('cadastro-usuario/', cadastro_usuario, name='cadastro_usuario'),
    path('iniciar-sessao/', iniciar_sessao, name='iniciar-sessao'),
    path('encerrar-sessao/', logout_view, name='logout'),
    path('upload-multi-modal/', upload_multi_modal, name='upload-multi-modal')
]
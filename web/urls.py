from django.urls import path

from .views import pagina_inicial, UploadMultiModalRequest, login_view, cadastro_usuario, LoginRequestView, logout_view, CreateUserView

urlpatterns = [
    path('', login_view, name='login_view'),
    path('pagina-inicial/', pagina_inicial, name='home'),
    path(
        'create_user/',
        view=CreateUserView.as_view(),
        name='create_user'
    ),
    path('cadastro-usuario/', cadastro_usuario, name='cadastro_usuario'),
    path(
        'login/',
        view=LoginRequestView.as_view(),
        name='login'
    ),
    path('encerrar-sessao/', logout_view, name='logout'),
    path(
        'upload-multi-modal/',
        view=UploadMultiModalRequest.as_view(),
        name='upload-multi-modal'
    )
]
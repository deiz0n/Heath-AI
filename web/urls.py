from django.shortcuts import redirect
from django.urls import path

from .views import render_home, UploadMultiModalRequestView, render_login, cadastro_usuario, LoginRequestView, logout_view, CreateUserView

urlpatterns = [
    path(
        '',
        lambda request: redirect('auth'),
        name='redirect_login'
    ),
    path(
        'auth',
         render_login,
         name='auth'
    ),
    path(
        'home/',
        render_home,
        name='home'
    ),
    path(
        'logout',
        logout_view,
        name='logout'
    ),
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
    path(
        'upload-multi-modal/',
        view=UploadMultiModalRequestView.as_view(),
        name='upload-multi-modal'
    )
]
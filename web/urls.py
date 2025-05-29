from django.shortcuts import redirect
from django.urls import path

from .views import render_home, UploadMultiModalRequestView, render_login, render_create_user, LoginRequestView, logout_view, CreateUserView, render_dashboard, FindPatientsRequest, FindPatientsByExamDate

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
    path('dashboard/',
         render_dashboard,
         name='dashboard'
    ),
    path(
        'logout',
        logout_view,
        name='logout'
    ),
    path(
        'register-user/',
        render_create_user,
        name='register_user'
    ),
    path(
        'create_user/',
        view=CreateUserView.as_view(),
        name='create_user'
    ),
    path(
        'login/',
        view=LoginRequestView.as_view(),
        name='login'
    ),
    path(
        'upload-multi-modal/',
        view=UploadMultiModalRequestView.as_view(),
        name='upload-multi-modal'
    ),
    path(
        'find_patients/',
        view=FindPatientsRequest.as_view(),
        name='find-patients'
    ),
    path(
        'find_patients_by_data_exam/',
        view=FindPatientsByExamDate.as_view(),
        name='find-patients-by-data-exam'
    )
]
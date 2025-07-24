from django.urls import path
from web.views.auth_views import (
    render_login,
    logout_view,
    render_create_user,
    CreateUserView,
    LoginRequestView
)

urlpatterns = [
    path('', render_login, name='auth'),
    path('login/', LoginRequestView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', render_create_user, name='register_user'),
    path('create/', CreateUserView.as_view(), name='create_user'),
]

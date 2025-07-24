from django.urls import path
from ..views.home_views import render_home

urlpatterns = [
    path('', render_home, name='home'),
]

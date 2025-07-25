from django.urls import path
from web.views.about_views import render_about

urlpatterns = [
    path('', render_about, name='about'),
]

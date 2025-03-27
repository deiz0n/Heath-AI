from django.urls import path

from .views import pagina_inicial, upload_raio_x

urlpatterns = [
    path('', pagina_inicial, name='home'),
    path('upload-raiox/', upload_raio_x, name='upload-raiox')
]
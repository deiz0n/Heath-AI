from django.urls import path

from .views import pagina_inicial, upload_raio_x, upload_ressonancia

urlpatterns = [
    path('', pagina_inicial, name='home'),
    path('upload-raiox/', upload_raio_x, name='upload-raiox'),
    path('upload-ressonancia/', upload_ressonancia, name='upload-ressonancia')
]
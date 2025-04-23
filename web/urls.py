from django.urls import path

from .views import pagina_inicial, upload_raio_x, upload_ressonancia, upload_multi_modal, login

urlpatterns = [
    path('', login, name='login'),
    path('pagina-inicial/', pagina_inicial, name='home'),
    path('upload-raiox/', upload_raio_x, name='upload-raiox'),
    path('upload-ressonancia/', upload_ressonancia, name='upload-ressonancia'),
    path('upload-multi-modal/', upload_multi_modal, name='upload-multi-modal')
]
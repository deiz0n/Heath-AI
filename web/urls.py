from django.urls import path

from .views import criar_multi_modal, buscar_multi_modais

urlpatterns = [
    path('documentos/criar/', criar_multi_modal),
    path('documentos/', buscar_multi_modais),
]
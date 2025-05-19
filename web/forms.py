from django.forms import ModelForm
from .models import RaioX, ImagensRessonancia, Ressonancia, Clinico, MultiModal

class RaioXForm(ModelForm):
    class Meta:
        model = RaioX
        fields = ["img_pd_cima", "img_pd_lateral", "img_pe_cima", "img_pe_lateral", "img_ambos_cima", "prontuario"]

class ImagensRessonanciaForm(ModelForm):
    class Meta:
        model = ImagensRessonancia
        fields = ["imagem"]

class RessonanciaForm(ModelForm):
    class Meta:
        model = Ressonancia
        fields = ["imagens", "prontuario"]

class ClinicoForm(ModelForm):
    class Meta:
        model = Clinico
        fields = ["nome", "sobrenome", "cpf", "crm", "data_aniversario", "email", "senha"]

class MultiModalForm(ModelForm):
    class Meta:
        model = MultiModal
        fields = ["raio_x", "ressonancia", "prontuario", "clinico"]



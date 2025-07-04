from django.forms import ModelForm
from .models import RaioX, ImagensRessonancia, Ressonancia, Clinico, MultiModal, Paciente

class XRayForm(ModelForm):
    class Meta:
        model = RaioX
        fields = ["img_pd_cima", "img_pd_lateral", "img_pe_cima", "img_pe_lateral", "img_ambos_cima", "prontuario"]

class ResonanceImagesForm(ModelForm):
    class Meta:
        model = ImagensRessonancia
        fields = ["imagem"]

class ResonanceForm(ModelForm):
    class Meta:
        model = Ressonancia
        fields = ["imagens", "prontuario"]

class ClinicianForm(ModelForm):
    class Meta:
        model = Clinico
        fields = ["nome", "sobrenome", "cpf", "crm", "data_aniversario", "email"]

class MultiModalForm(ModelForm):
    class Meta:
        model = MultiModal
        fields = ["raio_x", "ressonancia", "prontuario", "clinico"]

class PacienteForm(ModelForm):
    class Meta:
        model = Paciente
        fields = ["nome", "sobrenome", "cpf", "data_nascimento", "endereco"]


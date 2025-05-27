from django.contrib import admin
from django.db import models
import uuid
from cpf_field.models import CPFField

from django.contrib.auth.models import User

class RaioX(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img_pd_cima = models.ImageField(upload_to="imagens/raiox/")
    img_pd_lateral = models.ImageField(upload_to="imagens/raiox/")
    img_pe_cima = models.ImageField(upload_to="imagens/raiox/")
    img_pe_lateral = models.ImageField(upload_to="imagens/raiox/")
    img_ambos_cima = models.ImageField(upload_to="imagens/raiox/")
    prontuario = models.FileField(upload_to="prontuario/raiox", default="Prontuário não informado", null=True)
    
    def __str__(self):
        return str(self.id)

class ImagensRessonancia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    imagem = models.ImageField(upload_to="imagens/ressonancia")
    
    def __str__(self):
        return str(self.id)

class Ressonancia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    imagens = models.ManyToManyField(ImagensRessonancia)
    prontuario = models.FileField(upload_to="prontuario/ressonancia", default="Prontuário não informado", null=True)
    
    def __str__(self):
        return str(self.id)

class Clinico(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    nome = models.CharField(null=False, blank=False)
    sobrenome = models.CharField(null=False, blank=False)
    cpf = CPFField('cpf')
    crm = models.CharField(null=False, blank=False, unique=True)
    data_aniversario = models.DateField(null=False)
    email = models.EmailField(null=False, blank=False)
    senha = models.CharField(null=False, blank=False)

    def __str__(self):
        return str(f'{self.id} - {self.nome}')

class MultiModal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raio_x = models.OneToOneField(RaioX, on_delete=models.CASCADE, related_name='multimodal', null=True)
    ressonancia = models.OneToOneField(Ressonancia, on_delete=models.CASCADE, related_name='multimodal', null=True)
    data = models.DateTimeField(auto_now_add=True)
    prontuario = models.FileField(upload_to="prontuario/geral", default="Prontuário não informado", null=True)
    clinico = models.ForeignKey(Clinico, on_delete=models.CASCADE, related_name='exames', null=True, blank=False)
    
    def __str__(self):
        return str(self.id)

class Paciente(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    nome = models.CharField(null=False, blank=False)
    sobrenome = models.CharField(null=False, blank=False)
    cpf = CPFField('cpf')
    data_nascimento = models.DateField(null=False, blank=False)
    endereco = models.CharField(null=False, blank=False)
    exame = models.ManyToManyField(MultiModal, related_name='exames')

    def __str__(self):
        return str(f'{self.id} - {self.nome}')

admin.site.register(MultiModal)
admin.site.register(RaioX)
admin.site.register(Ressonancia)
admin.site.register(Clinico)
admin.site.register(Paciente)
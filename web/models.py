from django.contrib import admin
from django.db import models
import uuid


class RaioX(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img_pd_cima = models.ImageField(upload_to="imagens/raiox")
    img_pd_lateral = models.ImageField(upload_to="imagens/raiox")
    img_pe_cima = models.ImageField(upload_to="imagens/raiox")
    img_pe_lateral = models.ImageField(upload_to="imagens/raiox")
    img_ambos_cima = models.ImageField(upload_to="imagens/raiox")
    
    def __str__(self):
        return str(self.id)

class Ressonancia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    img_pd_cima = models.ImageField(upload_to="imagens/ressonancia/")
    img_pd_lateral = models.ImageField(upload_to="imagens/ressonancia/")
    img_pe_cima = models.ImageField(upload_to="imagens/ressonancia/")
    img_pe_lateral = models.ImageField(upload_to="imagens/ressonancia/")
    img_ambos_cima = models.ImageField(upload_to="imagens/ressonancia/")
    
    def __str__(self):
        return str(self.id)

class MultiModal(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raio_x = models.OneToOneField(RaioX, on_delete=models.CASCADE, related_name='multimodal')
    ressonancia = models.OneToOneField(Ressonancia, on_delete=models.CASCADE, related_name='multimodal')
    data = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return str(self.id)

admin.site.register(MultiModal)
admin.site.register(RaioX)
admin.site.register(Ressonancia)
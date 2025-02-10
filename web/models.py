from django.db import models
import uuid


class ImagemRaioX(models.Model):
    pd_direito_cima = models.ImageField(upload_to='imagens/raiox/')
    pd_direito_lateral = models.ImageField(upload_to='imagens/raiox/')
    pe_esquerdo_cima = models.ImageField(upload_to='imagens/raiox/')
    pe_esquerdo_lateral = models.ImageField(upload_to='imagens/raiox/')
    ambos_cima = models.ImageField(upload_to='imagens/raiox/')

class ImagemRessonancia(models.Model):
    pd_direito_cima = models.ImageField(upload_to='imagens/ressonancia/')
    pd_direito_lateral = models.ImageField(upload_to='imagens/ressonancia/')
    pe_esquerdo_cima = models.ImageField(upload_to='imagens/ressonancia/')
    pe_esquerdo_lateral = models.ImageField(upload_to='imagens/ressonancia/')
    ambos_cima = models.ImageField(upload_to='imagens/ressonancia/')

class Documento(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    raio_x = models.OneToOneField(ImagemRaioX, on_delete=models.CASCADE)
    ressonancia = models.OneToOneField(ImagemRessonancia, on_delete=models.CASCADE)
    data = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.id

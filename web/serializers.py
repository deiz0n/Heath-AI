from rest_framework import serializers 
from .models import Documento, ImagemRaioX, ImagemRessonancia

class DocumentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Documento
        fields = '__all__'
        
class ImagemRaioXSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemRaioX
        fields = '__all__'
        
class ImagemRessonanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagemRessonancia
        fields = '__all__'
    
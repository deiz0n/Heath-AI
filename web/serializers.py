from rest_framework import serializers 
from .models import MultiModal, RaioX, Ressonancia

class MultiModalSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultiModal
        fields = '__all__'
        
class RaioXSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaioX
        fields = '__all__'
        
class RessonanciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ressonancia
        fields = '__all__'
    
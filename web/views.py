from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view


from .serializers import MultiModalSerializer, RaioXSerializer, RessonanciaSerializer
from .models import MultiModal

@api_view(['POST'])
def criar_multi_modal(request):
    if request.method == 'POST':
        raio_x_data = {
            'img_pd_cima': request.data.get('raio_x[img_pd_cima]'),
            'img_pd_lateral': request.data.get('raio_x[img_pd_lateral]'),
            'img_pe_cima': request.data.get('raio_x[img_pe_cima]'),
            'img_pe_lateral': request.data.get('raio_x[img_pe_lateral]'),
            'img_ambos_cima': request.data.get('raio_x[img_ambos_cima]')
        }
        
        ressonancia_data = {
            'img_pd_cima': request.data.get('ressonancia[img_pd_cima]'),
            'img_pd_lateral': request.data.get('ressonancia[img_pd_lateral]'),
            'img_pe_cima': request.data.get('ressonancia[img_pe_cima]'),
            'img_pe_lateral': request.data.get('ressonancia[img_pe_lateral]'),
            'img_ambos_cima': request.data.get('ressonancia[img_ambos_cima]')
        }

        raio_x_serializer = RaioXSerializer(data=raio_x_data)
        ressonancia_serializer = RessonanciaSerializer(data=ressonancia_data)
    
        try:
            if raio_x_serializer.is_valid() and ressonancia_serializer.is_valid():
                raio_x = raio_x_serializer.save()
                ressonancia = ressonancia_serializer.save()

                documento_data = {
                    'raio_x': raio_x.id,
                    'ressonancia': ressonancia.id,
                    'data': request.data.get('data')
                }
                documento_serializer = MultiModalSerializer(data=documento_data)

                if documento_serializer.is_valid():
                    documento_serializer.save()
                    return Response(documento_serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response(documento_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def buscar_multi_modais(request):
    documentos = MultiModal.objects.all()
    serializer = MultiModalSerializer(documentos, many=True)
    return Response(serializer.data)
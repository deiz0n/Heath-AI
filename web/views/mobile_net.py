import os
import numpy as np
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
import tensorflow as tf
from io import BytesIO
from PIL import Image
import uuid

# --- 1. Carregamento do Modelo (Feito apenas uma vez) ---
# Carrega o modelo quando o servidor Django inicia.
# Isso evita recarregar o modelo em cada requisição.

# !! IMPORTANTE: AJUSTE ESTE CAMINHO !!
# Caminho para o seu modelo .h5, relativo à raiz do projeto (manage.py)
PATH_MODELO = os.path.join(settings.BASE_DIR, 'melhor_modelo.h5')

# !! IMPORTANTE: AJUSTE AS CLASSES !!
# Mapeamento das classes. O seu script usa 'binary'
# Verifique qual classe é 0 e qual é 1 (geralmente por ordem alfabética)
CLASS_NAMES = {
    0: 'Ligamento Normal',     # Exemplo: 'normal'
    1: 'Ligamento Rompido'     # Exemplo: 'rompido'
}

# Parâmetros do modelo (devem ser os mesmos do treinamento)
IMG_WIDTH, IMG_HEIGHT = 224, 224

try:
    model = tf.keras.models.load_model(PATH_MODELO)
except Exception as e:
    model = None 

# --- 2. Views do Django ---

# def index(request: HttpRequest) -> HttpResponse:
#     """
#     Renderiza a página principal com o formulário de upload.
#     """
#     return render(request, 'index.html')

def analisar_imagem_bytes(image_file: UploadedFile, exam_id: str) -> bool:
    """
    Analisa uma imagem e cria um ExamResult associado ao exame.
    
    Args:
        image_file: Arquivo de imagem (UploadedFile ou InMemoryUploadedFile)
        exam_id: UUID do exame para associar o resultado (pode ser string ou UUID)
    
    Returns:
        True se a análise foi bem-sucedida, False caso contrário
    """
    if model is None:
        return False

    try:
        from web.models import ExamResult
        
        # Converte exam_id para UUID se for string
        if isinstance(exam_id, str):
            exam_id = uuid.UUID(exam_id)
        
        # Pré-processamento da Imagem
        img_bytes = image_file.read()
        
        # Reset do ponteiro do arquivo para permitir leitura posterior
        image_file.seek(0)
        
        # Converte TIFF para formato compatível se necessário
        img_pil = Image.open(BytesIO(img_bytes))
        
        # Converte para RGB se necessário (TIFF pode ter outros modos)
        if img_pil.mode not in ('RGB', 'L'):
            img_pil = img_pil.convert('RGB')
        elif img_pil.mode == 'L':
            img_pil = img_pil.convert('RGB')
        
        # Redimensiona a imagem
        img_pil = img_pil.resize((IMG_WIDTH, IMG_HEIGHT))
        
        # Converte para array numpy
        img_array = np.array(img_pil) / 255.0
        img_batch = np.expand_dims(img_array, axis=0)

        # Predição
        prediction_proba = model.predict(img_batch, verbose=0)[0][0]
        
        # Interpreta o Resultado
        prediction_class_index = 1 if prediction_proba > 0.5 else 0
        prediction_class_name = CLASS_NAMES.get(prediction_class_index, "Desconhecido")
        confianca = prediction_proba if prediction_class_index == 1 else (1 - prediction_proba)

        
        # Cria o ExamResult com o diagnóstico no campo result
        exam_result = ExamResult.objects.create(
            exam_id=exam_id,
            result=prediction_class_name
        )

        return True

    except Exception as e:
        import traceback
        traceback.print_exc()
        return False

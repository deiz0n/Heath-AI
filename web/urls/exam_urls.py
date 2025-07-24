from django.urls import path
from web.views.exam_views import (
    RecordByExamIdRequest,
    GetXRayListByPatient,
    get_ressonance_by_exam_id
)

urlpatterns = [
    path('record/', RecordByExamIdRequest.as_view(), name='record-by-exam-id'),
    path('xray/', GetXRayListByPatient.as_view(), name='get_x_ray_by_exam_id'),
    path('resonance/', get_ressonance_by_exam_id, name='get_resonance_by_exam_id'),
]

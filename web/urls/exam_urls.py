from django.urls import path
from web.views.exam_views import (
    RecordByExamIdRequest,
    GetXRayListByPatient,
    get_ressonance_by_exam_id,
    serve_resonance_image,
    serve_xray_image,
    test_dicom_images,
    get_dicom_metadata,
    get_window_presets
)

urlpatterns = [
    path('record/', RecordByExamIdRequest.as_view(), name='record-by-exam-id'),
    path('xray/', GetXRayListByPatient.as_view(), name='get_x_ray_by_exam_id'),
    path('resonance/', get_ressonance_by_exam_id, name='get_resonance_by_exam_id'),
    path('resonance/image/<uuid:image_id>/', serve_resonance_image, name='serve_resonance_image'),
    path('xray/image/<uuid:image_id>/', serve_xray_image, name='serve_xray_image'),
    path('test-dicom/', test_dicom_images, name='test_dicom_images'),
    
    # APIs para metadados DICOM
    path('<str:image_type>/<uuid:image_id>/metadata/', get_dicom_metadata, name='get_dicom_metadata'),
    path('window-presets/<str:modality>/', get_window_presets, name='get_window_presets'),
]

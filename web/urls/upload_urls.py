from django.urls import path
from web.views.upload_views import UploadMultiModalRequestView

urlpatterns = [
    path('multi-modal/', UploadMultiModalRequestView.as_view(), name='upload-multi-modal'),
]

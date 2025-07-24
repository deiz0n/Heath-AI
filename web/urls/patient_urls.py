from django.urls import path
from web.views.patient_views import (
    FindPatientsRequest,
    FindPatientsByExamDate,
    RegisterPatient
)

urlpatterns = [
    path('find/', FindPatientsRequest.as_view(), name='find-patients'),
    path('find-by-date/', FindPatientsByExamDate.as_view(), name='find-patients-by-data-exam'),
    path('register/', RegisterPatient.as_view(), name='register_patient'),
]

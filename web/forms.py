from django.forms import ModelForm
from .models import XRay, ImagesXRay, Resonance, ImagesResonance, Clinician, Patient, Exam

class XRayForm(ModelForm):
    class Meta:
        model = XRay
        fields = ['record']

class ImagesXRayForm(ModelForm):
    class Meta:
        model = ImagesXRay
        fields = ['image', 'xray']

class ResonanceForm(ModelForm):
    class Meta:
        model = Resonance
        fields = ["record"]

class ResonanceImagesForm(ModelForm):
    class Meta:
        model = ImagesResonance
        fields = ["image", "resonance"]

class ClinicianForm(ModelForm):
    class Meta:
        model = Clinician
        fields = ["first_name", "last_name", "cpf", "crm", "birthday", "email", "password"]

class PatientForm(ModelForm):
    class Meta:
        model = Patient
        fields = ["first_name", "last_name", "cpf", "birthday", "address"]

class ExamForm(ModelForm):
    class Meta:
        model = Exam
        fields = ["type", "patient", "clinician", "xray", "resonance", "record"]

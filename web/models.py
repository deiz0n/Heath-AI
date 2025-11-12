from django.db import models
import uuid
from cpf_field.models import CPFField

from django.contrib.auth.hashers import make_password


class ExamType(models.TextChoices):
    _2D = "2D", "2D"
    _3D = "3D", "3D"

class XRay(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    record = models.FileField(upload_to="exams/%Y/%m/%d/records", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"X-Ray {self.id}"

class ImagesXRay(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.FileField(upload_to="exams/xray/images")
    xray = models.ForeignKey(XRay, related_name="images", on_delete=models.CASCADE)

    def __str__(self):
        return f"Image for X-Ray {self.xray.id}"

class Resonance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    record = models.FileField(upload_to="exams/%Y/%m/%d/records", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Resonance {self.id}"

class ImagesResonance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image = models.FileField(upload_to="exams/resonance/images")
    resonance = models.ForeignKey(Resonance, related_name="images", on_delete=models.CASCADE)

    def __str__(self):
        return f"Image for Resonance {self.resonance.id}"

class Clinician(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    cpf = CPFField(unique=True)
    crm = models.CharField(max_length=50, unique=True)
    birthday = models.DateField()
    email = models.EmailField()
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.pk or not Clinician.objects.filter(pk=self.pk, password=self.password).exists():
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Dr(a). {self.first_name} {self.last_name}"

class Patient(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    cpf = CPFField()
    birthday = models.DateField()
    address = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Exam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.CharField(max_length=3, choices=ExamType.choices)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="exams")
    clinician = models.ForeignKey(Clinician, on_delete=models.CASCADE, related_name="exams")
    xray = models.ForeignKey(XRay, on_delete=models.CASCADE, null=True, blank=True, related_name="exams")
    resonance = models.ForeignKey(Resonance, on_delete=models.CASCADE, null=True, blank=True, related_name="exams")
    record = models.FileField(upload_to="exams/%Y/%m/%d/records", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Exam {self.id} for {self.patient}"

class ExamResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    result = models.TextField(null=True, blank=True)  # Alterado de FileField para TextField
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="results")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for Exam {self.exam.id}"

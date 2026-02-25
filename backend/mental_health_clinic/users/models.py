from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        PATIENT = "PATIENT", "Patient"
        THERAPIST = "THERAPIST", "Therapist"

    role = models.CharField(max_length=50, choices=Role.choices)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.is_superuser:
                self.role = self.Role.ADMIN
        return super().save(*args, **kwargs)


class TherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=100, help_text="e.g. CBT, Trauma, Child Psychology")
    bio = models.TextField(blank=True)
    profile_image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    status = models.CharField(max_length=20, default='Active')
    date_of_birth = models.DateField(null=True, blank=True)
    GENDER_CHOICES = [
        ('Female therapist', 'Female therapist'),
        ('Male therapist', 'Male therapist'),
        ('Non-binary', 'Non-binary'),
    ]
    gender = models.CharField(max_length=50, choices=GENDER_CHOICES, blank=True, null=True)

    focus_areas = ArrayField(
        models.CharField(max_length=100),
        blank=True,
        default=list,
        help_text="e.g. ['Anxiety', 'Depression', 'Stress & burnout']"
    )

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialization})"

class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField()
    medical_history = models.TextField(blank=True, help_text="Past diagnoses or notes")
    emergency_contact = models.CharField(max_length=100, blank=True)
    plan = models.CharField(max_length=50, default='Standard Plan')
    therapist = models.ForeignKey(TherapistProfile, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='patients')
    status = models.CharField(max_length=20, default='Active')
    gender = models.CharField(max_length=50, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"Patient: {self.user.username}"
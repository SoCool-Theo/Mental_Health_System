from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model to handle multiple roles.
    We inherit from AbstractUser to keep Django's built-in auth (username, password, permissions).
    """

    class Role(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        PATIENT = "PATIENT", "Patient"
        THERAPIST = "THERAPIST", "Therapist"

    role = models.CharField(max_length=50, choices=Role.choices)

    # We can add common fields here if needed (e.g., phone_number)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.pk:  # If creating a new user
            if self.is_superuser:
                self.role = self.Role.ADMIN
        return super().save(*args, **kwargs)


class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField()
    medical_history = models.TextField(blank=True, help_text="Past diagnoses or notes")
    emergency_contact = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Patient: {self.user.username}"


class TherapistProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=100, help_text="e.g. CBT, Trauma, Child Psychology")
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Dr. {self.user.last_name} ({self.specialization})"
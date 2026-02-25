from django.db import models
#Import the profiles from users
from users.models import PatientProfile, TherapistProfile


class Service(models.Model):
    """
    Master Data: Defines what kind of therapy is being booked.
    Examples: 'CBT Session', 'Initial Consultation'
    """
    name = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField(default=60, help_text="Duration in minutes")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True, help_text="Uncheck to hide this service from booking")

    def __str__(self):
        return f"{self.name} ({self.duration_minutes} min)"


#--- Location ---
class Location(models.Model):
    """
    Physical clinic locations where appointments take place.
    """
    name = models.CharField(max_length=150, help_text="e.g. Main Clinic (Bangkok)")
    address = models.TextField(blank=True, null=True, help_text="Full street address")
    rooms = models.PositiveIntegerField(default=1, help_text="Number of available consultation rooms")

    # Toggle button for 'Open' vs 'Maintenance'
    is_active = models.BooleanField(default=True, help_text="Uncheck if location is closed for maintenance")

    def __str__(self):
        return f"{self.name} ({'Open' if self.is_active else 'Closed'})"


# --- Appointment ---
class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    # The Relationships
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='appointments')
    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE, related_name='schedule')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)

    # Time Management
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(editable=False)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True, help_text="Patient requests or Doctor notes")
    created_at = models.DateTimeField(auto_now_add=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Auto-calculate end_time based on the Service duration
        if self.service and self.start_time:
            from datetime import timedelta
            self.end_time = self.start_time + timedelta(minutes=self.service.duration_minutes)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient} with {self.therapist} on {self.start_time.strftime('%Y-%m-%d %H:%M')}"


class ClinicalNote(models.Model):
    appointment = models.OneToOneField('Appointment', on_delete=models.CASCADE, related_name='clinical_note', null=True)

    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='notes')
    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    diagnosis_code = models.CharField(max_length=50, blank=True, null=True)
    subjective_analysis = models.TextField(help_text="Patient reports, mood, etc.")

    observations = models.TextField(help_text="Therapist objective observations", blank=True, null=True)

    treatment_plan = models.TextField(help_text="Interventions & homework")
    is_draft = models.BooleanField(default=False, help_text="True if note is still in progress")

    def __str__(self):
        return f"Note for {self.patient} on {self.created_at.strftime('%Y-%m-%d')}"

# --- Availability ---
class Availability(models.Model):
    therapist = models.ForeignKey(TherapistProfile, on_delete=models.CASCADE, related_name='availabilities')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    class Meta:
        verbose_name_plural = "Availabilities"
        # Prevents the same doctor from creating duplicate slots
        unique_together = ('therapist', 'date', 'start_time')

    def __str__(self):
        return f"{self.therapist} available on {self.date} from {self.start_time.strftime('%H:%M')} to {self.end_time.strftime('%H:%M')}"

class ClinicOperatingHour(models.Model):
    DAY_CHOICES = [
        ('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday')
    ]

    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES, unique=True)
    is_open = models.BooleanField(default=True)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.day_of_week}: {'Open' if self.is_open else 'Closed'}"
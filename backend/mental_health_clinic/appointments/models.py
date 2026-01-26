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

    def __str__(self):
        return f"{self.name} ({self.duration_minutes} min)"


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
    end_time = models.DateTimeField(editable=False)  # We will calculate this automatically

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    notes = models.TextField(blank=True, help_text="Patient requests or Doctor notes")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Auto-calculate end_time based on the Service duration
        if self.service and self.start_time:
            from datetime import timedelta
            self.end_time = self.start_time + timedelta(minutes=self.service.duration_minutes)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient} with {self.therapist} on {self.start_time.strftime('%Y-%m-%d %H:%M')}"
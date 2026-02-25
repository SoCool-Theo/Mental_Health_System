from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from django.utils import timezone
from .models import ClinicalNote, Availability
from .serializers import ServiceSerializer, AppointmentSerializer, ClinicalNoteSerializer, PatientSerializer, AvailabilitySerializer
from users.models import PatientProfile

from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from datetime import timedelta
from django.db.models import Count
from .models import Appointment, Service

from rest_framework import viewsets
from .models import Location
from .serializers import LocationSerializer

from .models import ClinicOperatingHour
from .serializers import ClinicOperatingHourSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Admin / Superuser sees ALL
        if user.is_superuser:
            count = Appointment.objects.count()
            print(f"   ✅ ADMIN MODE: Returning all {count} appointments")
            return Appointment.objects.all()

        # 2. Patient
        if hasattr(user, 'patient_profile'):
            print("   ✅ PATIENT MODE")
            return Appointment.objects.filter(patient=user.patient_profile)

        # 3. Therapist
        if hasattr(user, 'therapist_profile'):
            print("   ✅ THERAPIST MODE")
            return Appointment.objects.filter(therapist=user.therapist_profile)

        # 4. Fallback
        print("   ❌ NO PROFILE FOUND: Returning empty list")
        return Appointment.objects.none()

    def perform_create(self, serializer):
        # This intercepts the POST request and forces the appointment
        # to be booked under the currently logged-in patient.
        if hasattr(self.request.user, 'patient_profile'):
            serializer.save(patient=self.request.user.patient_profile)
        else:
            raise ValidationError({"detail": "Only patients can book appointments."})

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

    def get_queryset(self):
        user = self.request.user

        # Admin can see all services, including inactive ones (for management purposes)
        if user.is_authenticated and user.role == 'ADMIN':
            return Service.objects.all()

        # Only show active ones for Patients, Therapists, or unauthenticated users
        return Service.objects.filter(is_active=True)

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Therapist: See patients linked to my appointments
        if hasattr(user, 'therapist_profile'):
            # "Find patients who have an appointment with Me"
            return PatientProfile.objects.filter(
                appointments__therapist=user.therapist_profile
            ).distinct()

        # 2. Admin: See everyone
        if user.is_superuser:
            return PatientProfile.objects.all()

        return PatientProfile.objects.none()

class ClinicalNoteViewSet(viewsets.ModelViewSet):
    serializer_class = ClinicalNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Only show notes written by this therapist
        if hasattr(user, 'therapist_profile'):
            return ClinicalNote.objects.filter(therapist=user.therapist_profile).order_by('-created_at')
        return ClinicalNote.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        # 1. Check if the user actually has a therapist profile
        if not hasattr(user, 'therapist_profile'):
            raise ValidationError(
                {"detail": "You must be a registered therapist to save clinical notes."}
            )
        # Auto-assign the therapist when saving
        serializer.save(therapist=self.request.user.therapist_profile)

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # 1. Therapist Mode: See and manage their own schedule
        if hasattr(user, 'therapist_profile'):
            return Availability.objects.filter(therapist=user.therapist_profile).order_by('date', 'start_time')

        # 2. Patient Mode: Look up a specific doctor's availability
        # The frontend will call: /api/availability/?therapist_id=5
        therapist_id = self.request.query_params.get('therapist_id')
        if therapist_id:
            return Availability.objects.filter(therapist__user__id=therapist_id, date__gte=timezone.now().date()).order_by('date', 'start_time')

        # 3. Admin: See all
        if user.is_superuser:
            return Availability.objects.all()

        return Availability.objects.none()

    def perform_create(self, serializer):
        # Auto-assign the logged-in therapist when they create a new time slot
        user = self.request.user
        if hasattr(user, 'therapist_profile'):
            serializer.save(therapist=user.therapist_profile)
        else:
            raise ValidationError({"detail": "Only therapists can set availability."})


class AdminDashboardStatsView(APIView):
    # Only allow users with is_staff=True to access this
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = timezone.now().date()

        # 1. Calculate "Appointments This Week" (Last 7 days)
        week_start = today - timedelta(days=6)

        # Get all appointments in the last 7 days
        recent_appts = Appointment.objects.filter(
            start_time__date__gte=week_start,
            start_time__date__lte=today
        )

        # Build a dictionary to hold the count for each day (e.g., {"Mon": 5, "Tue": 2})
        daily_counts = {}
        for i in range(7):
            day = week_start + timedelta(days=i)
            day_name = day.strftime("%a")  # Gets 'Mon', 'Tue', etc.
            # Count appointments for this specific day
            count = recent_appts.filter(start_time__date=day).count()
            daily_counts[day_name] = count

        # 2. Calculate "Service Breakdown" (Donut Chart)
        # Group by service and count them
        service_stats = Appointment.objects.values('service__name').annotate(count=Count('id'))

        # Format the data cleanly for the frontend
        service_breakdown = []
        for stat in service_stats:
            if stat['service__name']:  # Ignore nulls
                service_breakdown.append({
                    "name": stat['service__name'],
                    "count": stat['count']
                })

        return Response({
            "daily_appointments": daily_counts,
            "service_breakdown": service_breakdown
        })

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class ClinicOperatingHourViewSet(viewsets.ModelViewSet):
    queryset = ClinicOperatingHour.objects.all().order_by('id') # Keeps days in order
    serializer_class = ClinicOperatingHourSerializer
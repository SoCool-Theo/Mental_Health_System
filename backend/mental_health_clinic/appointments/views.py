from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer
from users.models import PatientProfile
from .serializers import PatientSerializer
from .models import ClinicalNote
from .serializers import ClinicalNoteSerializer
from rest_framework.exceptions import ValidationError

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

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

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
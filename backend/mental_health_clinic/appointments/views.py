from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer

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
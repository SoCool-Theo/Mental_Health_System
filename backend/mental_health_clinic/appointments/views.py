from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Service, Appointment
from .serializers import ServiceSerializer, AppointmentSerializer

# Import the custom permission
# from .permissions import IsOwnerOrTherapist

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]  # Ensures they are logged in

    def get_queryset(self):
        """
        This view should return a list of all the appointments
        for the currently authenticated user.
        """
        user = self.request.user

        # 1. Admin sees all
        if user.is_superuser or user.role == 'ADMIN':
            return Appointment.objects.all()

        # 2. Patient sees only their own
        if hasattr(user, 'patient_profile'):
            return Appointment.objects.filter(patient=user.patient_profile)

        # 3. Therapist sees only their schedule
        if hasattr(user, 'therapist_profile'):
            return Appointment.objects.filter(therapist=user.therapist_profile)

        # 4. Fallback (return nothing)
        return Appointment.objects.none()


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    # Services are public (anyone can see the price list), so we can leave permissions open or set to IsAuthenticated
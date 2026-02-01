from rest_framework import viewsets
from .models import PatientProfile, TherapistProfile
from .serializers import PatientProfileSerializer, TherapistProfileSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer

class TherapistProfileViewSet(viewsets.ModelViewSet):
    queryset = TherapistProfile.objects.all()
    serializer_class = TherapistProfileSerializer


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 1. Determine the Display Name
        full_name = f"{user.first_name} {user.last_name}".strip()
        if not full_name:
            full_name = user.username

        # 2. Add "Dr." prefix if they are a therapist
        # (Make sure 'therapist_profile' matches your related_name in models.py)
        if hasattr(user, 'therapist_profile'):
            display_name = f"Dr. {full_name}"
        else:
            display_name = full_name

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'display_name': display_name,

            # --- IMPORTANT: ADD THESE LINES ---
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            # ----------------------------------

            'is_therapist': hasattr(user, 'therapist_profile')
        })
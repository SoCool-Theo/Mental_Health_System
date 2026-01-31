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
        if hasattr(user, 'therapist_profile'):
            display_name = f"Dr. {full_name}"
        else:
            display_name = full_name

        return Response({
            'id': user.id,
            'username': user.username,
            'display_name': display_name,
            'is_therapist': hasattr(user, 'therapist_profile')
        })
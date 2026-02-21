from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import PatientProfile, TherapistProfile
from .serializers import PatientProfileSerializer, TherapistProfileSerializer, RegistrationSerializer

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

        # FIXED: Check for both standard and custom related_name syntax
        is_therapist = hasattr(user, 'therapistprofile') or hasattr(user, 'therapist_profile')

        # 2. Add "Dr." prefix if they are a therapist
        if is_therapist:
            display_name = f"Dr. {full_name}"
        else:
            display_name = full_name

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'display_name': display_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_therapist': is_therapist,

            # Safe check for profile image
            'profile_image': user.profile_image.url if hasattr(user, 'profile_image') and user.profile_image else None
        })


class RegisterView(APIView):
    # AllowAny ensures unauthenticated users can access the registration page
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully!",
                    "email": user.email,
                    # FIXED: Grabbing the role from the validated data instead of the User object
                    "role": serializer.validated_data.get('role')
                },
                status=status.HTTP_201_CREATED
            )

        # Returns automatically formatted error messages
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
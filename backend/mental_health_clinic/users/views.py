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
        full_name = f"{user.first_name} {user.last_name}".strip() or user.username
        is_therapist = hasattr(user, 'therapist_profile')
        display_name = f"Dr. {full_name}" if is_therapist else full_name

        profile_data = {}
        if is_therapist:
            profile = user.therapist_profile
            # Build the full URL for the image so Next.js can display it
            image_url = request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None

            profile_data = {
                'specialty': profile.specialization,
                'bio': profile.bio,
                'profile_image': image_url  # <-- Added this
            }

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'display_name': display_name,
            'is_therapist': is_therapist,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            **profile_data
        })

    def patch(self, request):
        user = request.user
        data = request.data

        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        user.save()

        if hasattr(user, 'therapist_profile'):
            profile = user.therapist_profile
            if 'specialty' in data: profile.specialization = data['specialty']
            if 'bio' in data: profile.bio = data['bio']

            # --- NEW: Catch the uploaded file ---
            if 'profile_image' in request.FILES:
                profile.profile_image = request.FILES['profile_image']

            profile.save()

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)


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


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        # 1. Verify the old password is correct
        if not user.check_password(current_password):
            return Response({"error": "Incorrect current password."}, status=status.HTTP_400_BAD_REQUEST)

        # 2. Set and hash the new password
        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)
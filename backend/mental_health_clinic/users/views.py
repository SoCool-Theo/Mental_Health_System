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
        is_patient = hasattr(user, 'patient_profile') # Check for patient profile
        display_name = f"Dr. {full_name}" if is_therapist else full_name

        profile_data = {}
        if is_therapist:
            profile = user.therapist_profile
            image_url = request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None
            focus_string = ', '.join(profile.focus_areas) if profile.focus_areas else ''

            profile_data = {
                'specialty': profile.specialization,
                'focus_areas': focus_string,
                'bio': profile.bio,
                'profile_image': image_url,
                'license_no': profile.license_number,
                'phone': user.phone_number,
                'dob': profile.date_of_birth,
                'gender': getattr(profile, 'gender', 'Prefer not to say')
            }
        elif is_patient:
            # --- NEW: ADD PATIENT DATA TO RESPONSE ---
            profile = user.patient_profile
            image_url = request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None
            profile_data = {
                'dob': profile.date_of_birth,
                'gender': getattr(profile, 'gender', 'Prefer not to say'),
                'address': getattr(profile, 'address', ''),
                'phone': user.phone_number,
                'profile_image': image_url
            }

        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'display_name': display_name,
            'is_superuser': user.is_superuser,
            'is_staff': user.is_staff,

            'role': (
                'admin' if user.is_superuser
                else 'doctor' if user.is_staff
                else 'patient'
            ),

            'is_therapist': is_therapist,
            'is_patient': is_patient,
            **profile_data
        })

    def patch(self, request):
        user = request.user
        data = request.data

        # 1. Update Core User Fields (Common for everyone)
        if 'first_name' in data: user.first_name = data['first_name']
        if 'last_name' in data: user.last_name = data['last_name']
        if 'email' in data: user.email = data['email']
        if 'phone' in data: user.phone_number = data['phone']
        user.save()

        # 2. Update Role-Specific Profile Fields
        if hasattr(user, 'therapist_profile'):
            profile = user.therapist_profile
            if 'specialty' in data: profile.specialization = data['specialty']
            if 'bio' in data: profile.bio = data['bio']
            if 'dob' in data: profile.date_of_birth = data['dob']
            if 'gender' in data: profile.gender = data['gender']

            if 'focus_areas' in data:
                raw_string = data['focus_areas']
                # Splits by comma and removes extra spaces: Turns "Anxiety, Stress" into ['Anxiety', 'Stress']
                profile.focus_areas = [f.strip() for f in raw_string.split(',') if f.strip()]

            # Handle Therapist Image Upload
            if 'profile_image' in request.FILES:
                profile.profile_image = request.FILES['profile_image']
            profile.save()

        elif hasattr(user, 'patient_profile'):
            profile = user.patient_profile

            # These fields must exist in your PatientProfile model
            if 'dob' in data: profile.date_of_birth = data['dob']
            if 'gender' in data: profile.gender = data['gender']
            if 'address' in data: profile.address = data['address']

            # --- ADD THESE TWO LINES FOR PATIENT IMAGE UPLOADS ---
            if 'profile_image' in request.FILES:
                profile.profile_image = request.FILES['profile_image']

            profile.save()

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user

        # Django automatically cascades this deletion to their Profile,
        # Appointments, and Clinical Notes tied to this user.
        user.delete()

        return Response({"message": "Account permanently deleted."}, status=status.HTTP_200_OK)


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


from django.contrib.auth import get_user_model
User = get_user_model()


class PatientListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Security Check
        if not hasattr(user, 'therapist_profile'):
            return Response({"error": "Only therapists can view assigned patients."}, status=status.HTTP_403_FORBIDDEN)

        # --- THE PATIENT FILTER ---
        # Uses 'patient_profile__appointments' because your patient ForeignKey has related_name='appointments'
        patients = User.objects.filter(
            patient_profile__isnull=False,
            patient_profile__appointments__therapist=user.therapist_profile
        ).distinct()

        contact_list = []
        for patient in patients:
            profile = patient.patient_profile
            image_url = request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None

            contact_list.append({
                'id': patient.id,
                'name': f"{patient.first_name} {patient.last_name}".strip() or patient.username,
                'img': image_url,
                'tag': 'Patient',
                'lastMsg': 'Click to view conversation...',
                'unread': 0,
                'time': ''
            })

        return Response(contact_list, status=status.HTTP_200_OK)


class DoctorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Security Check
        if not hasattr(user, 'patient_profile'):
            return Response({"error": "Only patients can view assigned doctors."}, status=status.HTTP_403_FORBIDDEN)

        # --- THE DOCTOR FILTER ---
        # Uses 'therapist_profile__schedule' because your therapist ForeignKey has related_name='schedule'
        doctors = User.objects.filter(
            therapist_profile__isnull=False,
            therapist_profile__schedule__patient=user.patient_profile
        ).distinct()

        contact_list = []
        for doctor in doctors:
            profile = doctor.therapist_profile
            image_url = request.build_absolute_uri(profile.profile_image.url) if profile.profile_image else None

            contact_list.append({
                'id': doctor.id,
                'name': f"Dr. {doctor.first_name} {doctor.last_name}".strip() or f"Dr. {doctor.username}",
                'img': image_url,
                'tag': profile.specialization or 'Therapist',
                'lastMsg': 'Click to view conversation...',
                'unread': 0,
                'time': ''
            })

        return Response(contact_list, status=status.HTTP_200_OK)
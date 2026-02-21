from rest_framework import serializers
from django.db import transaction
from .models import User, PatientProfile, TherapistProfile


# ==========================================
# EXISTING SERIALIZERS
# ==========================================

class UserSerializer(serializers.ModelSerializer):
    # We add a calculated field for the frontend to easily check roles
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        # Ensure 'role' is in the fields list
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser']

    def get_role(self, obj):
        if obj.is_superuser:
            return 'admin'
        elif obj.is_staff:
            return 'doctor'
        else:
            return 'patient'


class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'date_of_birth', 'medical_history']


class TherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TherapistProfile
        fields = ['id', 'user', 'license_number', 'specialization', 'bio']


# ==========================================
# NEW: REGISTRATION SERIALIZER
# ==========================================

class RegistrationSerializer(serializers.Serializer):
    # Match the exact keys coming from the React frontend payload
    role = serializers.ChoiceField(choices=['PATIENT', 'THERAPIST'])
    firstName = serializers.CharField(max_length=150)
    lastName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    # Conditional fields (Frontend sends dob OR licenseNo)
    dob = serializers.DateField(required=False, allow_null=True)
    licenseNo = serializers.CharField(required=False, allow_blank=True, max_length=50)

    def validate(self, data):
        """Ensure conditional fields are present based on the role."""
        role = data.get('role')

        if role == 'PATIENT' and not data.get('dob'):
            raise serializers.ValidationError({"dob": "Date of birth is required for patients."})

        if role == 'THERAPIST' and not data.get('licenseNo'):
            raise serializers.ValidationError({"licenseNo": "License number is required for therapists."})

        # Check if email is already registered
        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        return data

    @transaction.atomic
    def create(self, validated_data):
        """Creates the Base User and their corresponding Profile."""
        role = validated_data['role']
        email = validated_data['email']

        # Determine if they are staff based on your `get_role` logic
        is_staff_user = True if role == 'THERAPIST' else False

        # 1. Create the Base User
        user = User.objects.create_user(
            username=email,  # Using email as the username
            email=email,
            password=validated_data['password'],
            first_name=validated_data['firstName'],
            last_name=validated_data['lastName'],
            is_staff=is_staff_user,
            role=role
        )

        # 2. Create the specific Profile
        if role == 'PATIENT':
            PatientProfile.objects.create(
                user=user,
                date_of_birth=validated_data['dob'],
                medical_history=""  # Default empty, update later
            )
        elif role == 'THERAPIST':
            TherapistProfile.objects.create(
                user=user,
                license_number=validated_data['licenseNo'],  # Maps frontend camelCase to backend snake_case
                specialization="",  # Default empty, update later
                bio=""  # Default empty, update later
            )

        return user
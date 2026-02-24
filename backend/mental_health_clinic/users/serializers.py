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
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_staff', 'is_superuser', 'phone_number']

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
        fields = ['id', 'user', 'date_of_birth', 'medical_history', 'plan', 'therapist', 'status', 'gender', 'address','profile_image']

    def update(self, instance, validated_data):
        # 1. See what the Admin set the new status to (defaults to current if not provided)
        new_status = validated_data.get('status', instance.status)

        # 2. Tie your custom status to Django's core security lock
        if new_status in ['Inactive', 'Archived', 'Locked']:
            instance.user.is_active = False
        elif new_status == 'Active':
            instance.user.is_active = True

        instance.user.save()  # Save the lock

        # 3. Save the rest of the profile data normally
        return super().update(instance, validated_data)


class TherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TherapistProfile
        fields = ['id', 'user', 'license_number', 'specialization', 'bio', 'profile_image', 'status', 'gender',
                  'focus_areas']

    def update(self, instance, validated_data):
        new_status = validated_data.get('status', instance.status)

        # For staff, we lock them out if they are Inactive or On Leave
        if new_status in ['Inactive', 'On Leave']:
            instance.user.is_active = False
        elif new_status == 'Active':
            instance.user.is_active = True

        instance.user.save()

        return super().update(instance, validated_data)


# ==========================================
# REGISTRATION SERIALIZER
# ==========================================

class RegistrationSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=['PATIENT', 'THERAPIST'])
    firstName = serializers.CharField(max_length=150)
    lastName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    # Conditional fields
    dob = serializers.DateField(required=False, allow_null=True)
    licenseNo = serializers.CharField(required=False, allow_blank=True, max_length=50)

    # Existing patient/therapist fields
    plan = serializers.CharField(required=False, allow_blank=True)
    assignedTherapist = serializers.IntegerField(required=False, allow_null=True)
    specialization = serializers.CharField(required=False, allow_blank=True, max_length=100)

    # --- 1. NEW FIELDS FOR THERAPISTS ---
    gender = serializers.CharField(required=False, allow_blank=True, max_length=50)
    focus_areas = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        default=list
    )
    # ADDED THIS LINE:
    profile_image = serializers.ImageField(required=False, allow_null=True)

    def validate(self, data):
        role = data.get('role')

        if role == 'PATIENT' and not data.get('dob'):
            raise serializers.ValidationError({"dob": "Date of birth is required for patients."})

        if role == 'THERAPIST' and not data.get('licenseNo'):
            raise serializers.ValidationError({"licenseNo": "License number is required for therapists."})

        if User.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        return data

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data['role']
        email = validated_data['email']
        is_staff_user = True if role == 'THERAPIST' else False

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['firstName'],
            last_name=validated_data['lastName'],
            is_staff=is_staff_user,
            role=role
        )

        if role == 'PATIENT':
            PatientProfile.objects.create(
                user=user,
                date_of_birth=validated_data['dob'],
                plan=validated_data.get('plan', 'Standard Plan'),
                therapist_id=validated_data.get('assignedTherapist'),
                medical_history=""
            )
        elif role == 'THERAPIST':
            TherapistProfile.objects.create(
                user=user,
                license_number=validated_data['licenseNo'],
                specialization=validated_data.get('specialization', ''),
                bio="",
                # --- 2. PASS THE NEW DATA INTO THE PROFILE ---
                gender=validated_data.get('gender', ''),
                focus_areas=validated_data.get('focus_areas', []),
                # ADDED THIS LINE:
                profile_image=validated_data.get('profile_image')
            )

        return user
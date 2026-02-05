from rest_framework import serializers
from .models import User, PatientProfile, TherapistProfile

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
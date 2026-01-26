from rest_framework import serializers
from .models import User, PatientProfile, TherapistProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Include user details automatically

    class Meta:
        model = PatientProfile
        fields = ['id', 'user', 'date_of_birth', 'medical_history']

class TherapistProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TherapistProfile
        fields = ['id', 'user', 'license_number', 'specialization', 'bio']
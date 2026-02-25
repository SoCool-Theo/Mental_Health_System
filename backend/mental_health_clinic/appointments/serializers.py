from rest_framework import serializers
from .models import Service, Appointment
from users.serializers import PatientProfileSerializer, TherapistProfileSerializer
from users.models import PatientProfile
from .models import ClinicalNote
from .models import Availability
from .models import Location
from .models import ClinicOperatingHour

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'duration_minutes', 'price', 'is_active']

class ClinicalNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicalNote
        fields = '__all__'
        read_only_fields = ['therapist', 'created_at']

class AppointmentSerializer(serializers.ModelSerializer):

    therapist_details = TherapistProfileSerializer(source='therapist', read_only=True)
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    service_details = ServiceSerializer(source='service', read_only=True)
    clinical_note = ClinicalNoteSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'therapist', 'service',
            'start_time', 'end_time', 'status', 'notes',
            'therapist_details', 'patient_details', 'service_details',
            'clinical_note'
        ]
        read_only_fields = ['patient', 'status', 'end_time']

    def validate_service(self, value):
        """
        This ensures nobody can book an appointment with an inactive service.
        """
        # 'value' is the Service object the user is trying to book
        if value and not value.is_active:
            raise serializers.ValidationError("This service is currently inactive and cannot be booked.")

        return value

class PatientSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    full_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = PatientProfile
        fields = ['id', 'user_name', 'full_name', 'date_of_birth', 'medical_history', 'emergency_contact']

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = ['id', 'therapist', 'date', 'start_time', 'end_time']
        read_only_fields = ['therapist']

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'rooms', 'is_active']

class ClinicOperatingHourSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClinicOperatingHour
        fields = ['id', 'day_of_week', 'is_open', 'start_time', 'end_time']
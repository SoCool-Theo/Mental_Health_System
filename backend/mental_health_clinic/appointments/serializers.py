from rest_framework import serializers
from .models import Service, Appointment
from users.serializers import PatientProfileSerializer, TherapistProfileSerializer

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    # These "details" fields let us see the actual names (e.g. "Dr. Smith")
    # instead of just IDs (e.g. "4") when we READ data.
    therapist_details = TherapistProfileSerializer(source='therapist', read_only=True)
    patient_details = PatientProfileSerializer(source='patient', read_only=True)
    service_details = ServiceSerializer(source='service', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'therapist', 'service',
            'start_time', 'end_time', 'status', 'notes',
            'therapist_details', 'patient_details', 'service_details'
        ]
        read_only_fields = ['end_time', 'created_at']
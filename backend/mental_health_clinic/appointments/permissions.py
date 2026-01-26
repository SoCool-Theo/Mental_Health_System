from rest_framework import permissions

class IsOwnerOrTherapist(permissions.BasePermission):
    """
    Custom permission to only allow:
    1. Patients to see/edit their OWN appointments.
    2. Therapists to see appointments assigned to them.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        # BUT we need to filter the list in the View, not just here.

        # This part handles specific object access (e.g., /appointments/1/)

        # 1. Superusers can do anything
        if request.user.is_superuser:
            return True

        # 2. If user is the Patient linked to the appointment
        if hasattr(request.user, 'patient_profile') and obj.patient == request.user.patient_profile:
            return True

        # 3. If user is the Therapist linked to the appointment
        if hasattr(request.user, 'therapist_profile') and obj.therapist == request.user.therapist_profile:
            return True

        return False
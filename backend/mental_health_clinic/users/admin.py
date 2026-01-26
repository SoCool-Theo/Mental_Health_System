from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PatientProfile, TherapistProfile

# This allows you to edit the Custom User in the admin panel
admin.site.register(User, UserAdmin)
admin.site.register(PatientProfile)
admin.site.register(TherapistProfile)
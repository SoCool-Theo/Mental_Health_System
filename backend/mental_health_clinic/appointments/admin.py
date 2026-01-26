from django.contrib import admin
from .models import Service, Appointment

class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'therapist', 'start_time', 'status')
    list_filter = ('status', 'start_time')

admin.site.register(Service)
admin.site.register(Appointment, AppointmentAdmin)
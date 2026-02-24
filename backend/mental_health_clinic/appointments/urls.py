from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, AppointmentViewSet, PatientViewSet, ClinicalNoteViewSet, AvailabilityViewSet
from .views import AdminDashboardStatsView
from .views import LocationViewSet
from .views import ClinicOperatingHourViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'clinical-notes', ClinicalNoteViewSet, basename='clinical-note')
router.register(r'availability', AvailabilityViewSet, basename='availability')
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'operating-hours', ClinicOperatingHourViewSet, basename='operating-hours')

urlpatterns = [
    path('', include(router.urls)),
    path('admin-stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
]
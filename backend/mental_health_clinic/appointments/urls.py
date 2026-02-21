from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, AppointmentViewSet, PatientViewSet, ClinicalNoteViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'notes', ClinicalNoteViewSet, basename='clinical-note')
router.register(r'availability', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
]
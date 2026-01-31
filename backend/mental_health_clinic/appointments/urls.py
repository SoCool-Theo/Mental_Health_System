from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, AppointmentViewSet, PatientViewSet, ClinicalNoteViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'notes', ClinicalNoteViewSet, basename='clinical-note')

urlpatterns = [
    path('', include(router.urls)),
]
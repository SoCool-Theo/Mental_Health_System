from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, AppointmentViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet)
router.register(r'appointments', AppointmentViewSet, basename='appointments')

urlpatterns = [
    path('', include(router.urls)),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientProfileViewSet, TherapistProfileViewSet
from .views import CurrentUserView

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet)
router.register(r'therapists', TherapistProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('me/', CurrentUserView.as_view(), name='current-user'),
]
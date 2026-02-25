from django.urls import path
from .views import ChatThreadView

urlpatterns = [
    path('messages/<int:other_user_id>/', ChatThreadView.as_view(), name='chat-thread'),
]
from django.db.models import Q
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer

User = get_user_model()


class ChatThreadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, other_user_id):
        """
        Fetch the entire chat history between the logged-in user and 'other_user_id'.
        """
        # We use Q objects to get messages where YOU are the sender OR YOU are the receiver
        messages = Message.objects.filter(
            Q(sender=request.user, receiver_id=other_user_id) |
            Q(sender_id=other_user_id, receiver=request.user)
        ).order_by('timestamp')  # Sort chronologically

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request, other_user_id):
        """
        Send a new message to 'other_user_id'.
        """
        serializer = MessageSerializer(data=request.data)

        if serializer.is_valid():
            try:
                receiver = User.objects.get(id=other_user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

            # Securely save the message. We manually inject the sender and receiver!
            serializer.save(sender=request.user, receiver=receiver)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
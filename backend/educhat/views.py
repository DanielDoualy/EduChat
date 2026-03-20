from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from educhat.services.ai_service import generate_ai_response, detect_subject, generate_chat_title

from .models import User, Chat, Message
from .serializers import UserSerializer, ChatSerializer, MessageSerializer

from rest_framework.pagination import PageNumberPagination

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)


class NoPagination(PageNumberPagination):
    page_size = None

class ChatViewSet(ModelViewSet):
    serializer_class = ChatSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NoPagination  # desactive la pagination

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NoPagination  # desactive la pagination

    def get_queryset(self):
        chat_id = self.request.query_params.get("chat")
        if chat_id:
            return Message.objects.filter(chat_id=chat_id)
        return Message.objects.all()


class CreateChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        subject = request.data.get("subject", "Nouveau chat")
        chat = Chat.objects.create(user=request.user, subject=subject)
        return Response({"chat_id": chat.id, "subject": chat.subject}, status=201)




class AIChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        chat_id = request.data.get("chat_id")
        question = request.data.get("message")

        if not question:
            return Response({"error": "Message is required"}, status=400)
        if not chat_id:
            return Response({"error": "chat_id is required"}, status=400)

        chat = get_object_or_404(Chat, id=chat_id, user=request.user)

        # Detecte la matiere de la question
        detected_subject = detect_subject(question)

        # Si matiere differente cree un nouveau chat
        if detected_subject and detected_subject != chat.subject:
            new_chat = Chat.objects.create(
                user=request.user,
                subject=detected_subject
            )
            chat = new_chat
            chat_id = new_chat.id

        Message.objects.create(
            chat=chat,
            sender="user",
            content=question
        )

        # Verifie si c'est le premier message du chat
        message_count = Message.objects.filter(chat=chat, sender="user").count()
        is_first_message = message_count == 1

        # Genere un titre dynamique au premier message
        if is_first_message:
            title = generate_chat_title(question)
            chat.title = title
            chat.save()

        recent_messages = Message.objects.filter(chat=chat).order_by("-created_at")[:20]
        recent_messages = reversed(recent_messages)

        conversation = []
        for message in recent_messages:
            role = "user" if message.sender == "user" else "assistant"
            conversation.append({
                "role": role,
                "content": message.content
            })

        subject = chat.subject.lower()
        level = request.user.level

        try:
            answer, tokens = generate_ai_response(conversation, subject=subject, level=level)
            if not answer:
                return Response({"error": "L'IA n'a pas retourné de réponse."}, status=502)

        except TimeoutError:
            Message.objects.create(chat=chat, sender="bot", content="L'IA n'a pas répondu à temps.", is_error=True)
            return Response({"error": "L'IA n'a pas répondu à temps."}, status=504)

        except Exception as e:
            print("ERREUR IA :", str(e))
            Message.objects.create(chat=chat, sender="bot", content=str(e), is_error=True)
            return Response({"error": f"Erreur : {str(e)}"}, status=500)

        Message.objects.create(
            chat=chat,
            sender="bot",
            content=answer,
            tokens_used=tokens
        )

        return Response({
            "chat_id": chat.id,
            "subject": chat.subject,
            "level": level,
            "tokens_used": tokens,
            "response": answer,
            "title": chat.title,           # retourne le titre genere
            "detected_subject": detected_subject
        })
        
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "level": user.level
        })
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
    pagination_class = NoPagination

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MessageViewSet(ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = NoPagination

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

        # Detecte la matiere uniquement si le score est suffisamment eleve
        # pour eviter les faux changements de chat sur des questions de suivi
        detected_subject = detect_subject(question)
        subject_changed = False

        if detected_subject and detected_subject != chat.subject:
            # Verifie si le chat actuel a deja des messages
            # Si oui, c'est probablement une question de suivi dans le meme contexte
            existing_messages_count = Message.objects.filter(chat=chat).count()

            if existing_messages_count == 0:
                # Chat vide — changer de matiere est logique
                chat.subject = detected_subject
                chat.save()
            else:
                # Chat avec historique — ne pas changer de chat
                # L'IA gardera le contexte de la conversation
                detected_subject = None

        # Sauvegarde le message utilisateur
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

        # Recupere tout l'historique du chat dans le bon ordre chronologique
        # pour que l'IA ait le contexte complet de la conversation
        all_messages = Message.objects.filter(chat=chat).order_by("created_at")

        conversation = []
        for message in all_messages:
            role = "user" if message.sender == "user" else "assistant"
            conversation.append({
                "role": role,
                "content": message.content
            })

        subject = chat.subject.lower()
        level = request.user.level

        try:
            answer, tokens = generate_ai_response(
                conversation,
                subject=subject,
                level=level
            )
            if not answer:
                return Response({"error": "L'IA n'a pas retourné de réponse."}, status=502)

        except TimeoutError:
            Message.objects.create(
                chat=chat,
                sender="bot",
                content="L'IA n'a pas répondu à temps.",
                is_error=True
            )
            return Response({"error": "L'IA n'a pas répondu à temps."}, status=504)

        except Exception as e:
            print("ERREUR IA :", str(e))
            Message.objects.create(
                chat=chat,
                sender="bot",
                content=str(e),
                is_error=True
            )
            return Response({"error": f"Erreur : {str(e)}"}, status=500)

        # Sauvegarde la reponse de l'IA
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
            "title": chat.title,
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
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import AIChatView, ChatViewSet, MessageViewSet, ProfileView, RegisterView, CreateChatView 

router = DefaultRouter()

router.register("chats", ChatViewSet, basename="chat")
router.register("messages", MessageViewSet, basename="message")

# RegisterView n'avait aucune URL → 404 dans Postman sur /register/
# On ajoute manuellement la route car APIView ne s'enregistre pas avec router.register()
urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("ai/chat/", AIChatView.as_view(), name="chatbot"),
    path("chats/create/", CreateChatView.as_view(), name="create-chat"),
    path("profile/", ProfileView.as_view(), name="profile"),
] + router.urls
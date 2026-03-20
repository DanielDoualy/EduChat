from rest_framework import serializers
from .models import User, Chat, Message


"""
Declaration des class serializers afin de pouvoir transformer 
les objets des models en format json 
et aussi transformer les objets json en objet des models
"""


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "password",       
            "date_joined",
            "level"
        ]

        extra_kwargs = {
            "password": {"write_only": True}   # password reçu mais jamais renvoyé en réponse
        }

    
    # Sans ça, Django stocke le mot de passe en clair → l'authentification échoue toujours
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ChatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chat
        fields = [
            "id",
            "title",
            "created_at",
            "user"
        ]
        # user sera injecté automatiquement via perform_create dans la vue
        # donc on le rend optionnel ici pour ne pas bloquer le POST
        extra_kwargs = {
            "user": {"read_only": True}
        }


class MessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Message
        fields = [
            "id",
            "chat",
            "sender",        
            "content",
            "created_at"
        ]
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    On garde exactement ton modèle User.
    Le niveau est crucial car le bot adaptera ses réponses
    en fonction de college / lycee / universite.
    """

    LEVEL_CHOICES = [
        ("college", "College"),
        ("lycee", "Lycee"),
        ("universite", "Universite"),
    ]

    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="college")


class Chat(models.Model):
    """
    AJOUT : subject — la matière du chat (Maths, Physique, etc.)
    Sans ça, impossible de savoir dans quel contexte scolaire on est.
    Le bot a besoin de cette info pour cadrer ses réponses.

    AJOUT : updated_at — pour trier les chats par activité récente
    comme ChatGPT qui montre le chat le plus récent en premier.
    """

    SUBJECT_CHOICES = [
        ("maths", "Mathematiques"),
        ("physique", "Physique"),
        ("chimie", "Chimie"),
        ("svt", "SVT"),
        ("geographie", "Geographie"),
        ("histoire", "Histoire"),   
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats")
    title = models.CharField(max_length=200)

    # AJOUT : matière concernée par ce chat
    subject = models.CharField(
        max_length=20,
        choices=SUBJECT_CHOICES,
        default="maths"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # AJOUT : mis à jour à chaque nouveau message → permet de trier par activité
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        # Les chats les plus récemment actifs apparaissent en premier
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.user.username} — {self.title} ({self.subject})"


class Message(models.Model):
    """
    AJOUT : is_error — savoir si le bot a échoué à répondre
    Utile pour afficher un message d'erreur côté frontend
    sans casser la conversation.

    AJOUT : tokens_used — suivre combien de tokens l'API IA a consommé
    pour pouvoir gérer des limites d'utilisation par user si nécessaire.
    """

    SENDER_CHOICES = [
        ("user", "User"),
        ("bot", "Bot"),
    ]

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    content = models.TextField()

    # AJOUT : marquer si le bot a retourné une erreur (ex: API IA indisponible)
    is_error = models.BooleanField(default=False)

    # AJOUT : nombre de tokens consommés par ce message (optionnel, utile pour les limites)
    tokens_used = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Les messages s'affichent dans l'ordre chronologique
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.sender} — {self.chat.title} : {self.content[:50]}"
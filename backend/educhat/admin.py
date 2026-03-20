from django.contrib import admin
from .models import User, Chat, Message


# USER
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "level", "is_staff", "is_active", "date_joined")
    list_filter = ("level", "is_staff", "is_active")
    search_fields = ("username", "email")
    ordering = ("-date_joined",)
    fieldsets = (
        ("Informations personnelles", {
            "fields": ("username", "email", "first_name", "last_name", "level")
        }),
        ("Permissions", {
            "fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")
        }),
        ("Dates", {
            "fields": ("date_joined", "last_login")
        }),
    )
    readonly_fields = ("date_joined", "last_login")



# MESSAGE (inline dans Chat)
class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ("sender", "content", "is_error", "tokens_used", "created_at")
    fields = ("sender", "content", "is_error", "tokens_used", "created_at")
    ordering = ("created_at",)
    can_delete = False


# CHAT
@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "subject", "message_count", "total_tokens", "created_at", "updated_at")
    list_filter = ("subject",)
    search_fields = ("title", "user__username")
    ordering = ("-updated_at",)
    readonly_fields = ("created_at", "updated_at")
    inlines = [MessageInline]  # ✅ affiche les messages directement dans le chat

    def message_count(self, obj):
        return obj.messages.count()
    message_count.short_description = "Messages"

    def total_tokens(self, obj):
        return sum(obj.messages.values_list("tokens_used", flat=True))
    total_tokens.short_description = "Tokens utilisés"



# MESSAGE
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ("id", "chat", "sender", "short_content", "is_error", "tokens_used", "created_at")
    list_filter = ("sender", "is_error")
    search_fields = ("content", "chat__title", "chat__user__username")
    ordering = ("-created_at",)
    readonly_fields = ("created_at",)

    def short_content(self, obj):
        return obj.content[:60] + "..." if len(obj.content) > 60 else obj.content
    short_content.short_description = "Contenu"
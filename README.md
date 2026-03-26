# EduChat

EduChat est une application web de chatbot éducatif alimenté par une IA. Elle permet aux élèves et étudiants d'obtenir des explications claires et adaptées à leur niveau scolaire dans plusieurs matières : Mathématiques, Physique, SVT, Chimie, Histoire et Géographie.

---

## Fonctionnalités

- Inscription et connexion avec authentification JWT
- Sélection de la matière et adaptation des réponses selon le niveau scolaire (collège, lycée, université)
- Détection automatique de la matière à partir du message envoyé
- Historique des conversations sauvegardé en base de données
- Génération automatique du titre du chat à partir du premier message
- Recherche dans l'historique des chats
- Interface responsive avec sidebar rétractable

---

## Stack Technique

**Backend**
- Python 3.12 / Django 6
- Django REST Framework
- PostgreSQL
- JWT Authentication (djangorestframework-simplejwt)
- Groq API (modèle llama-3.1-8b-instant)

**Frontend**
- React 18 (Vite)
- React Router DOM
- CSS natif

---

## Architecture

### Backend
```
backend/
├── backend/
│   ├── settings.py       # Configuration Django
│   ├── urls.py           # Routes principales
│   └── wsgi.py
├── educhat/
│   ├── models.py         # Modèles User, Chat, Message
│   ├── serializers.py    # Sérialiseurs DRF
│   ├── views.py          # Vues API (Register, Login, Chat, IA)
│   ├── urls.py           # Routes de l'application
│   ├── admin.py          # Interface d'administration
│   └── services/
│       └── ai_service.py # Logique d'appel à l'IA Groq
├── manage.py
├── requirements.txt
└── Procfile
```

L'API expose les endpoints suivants :
- `POST /api/register/` — inscription
- `POST /api/token/` — connexion et obtention du token JWT
- `GET /api/profile/` — profil de l'utilisateur connecté
- `GET /api/chats/` — liste des chats
- `POST /api/chats/create/` — création d'un chat
- `DELETE /api/chats/{id}/` — suppression d'un chat
- `GET /api/messages/?chat={id}` — messages d'un chat
- `POST /api/ai/chat/` — envoi d'un message et réponse de l'IA

### Frontend
```
frontend/educhat/
├── public/
├── src/
│   ├── assets/           # Icones SVG
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── InputField.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── Message.jsx
│   │   ├── MessageInput.jsx
│   │   ├── Sidebar.jsx
│   │   └── SubjectSelector.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ChatPage.jsx
│   ├── services/
│   │   └── api.js        # Centralisation des appels API
│   ├── styles/
│   │   ├── auth.css
│   │   ├── chat.css
│   │   └── home.css
│   └── App.jsx
├── vercel.json
└── package.json
```

La logique de l'application est centralisée dans `ChatPage.jsx` qui gère les états et les appels API. Les composants enfants reçoivent les données via props et remontent les actions via des fonctions callback.

---

## Déploiement

Le backend est déployé sur **Render** avec une base de données PostgreSQL. Le frontend est déployé sur **Vercel**. Les deux services se redéploient automatiquement à chaque push sur la branche `main`.

- Backend : https://educhat-gjgf.onrender.com
- Frontend : https://edu-chat-ivory.vercel.app

---

## Installation locale

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend**
```bash
cd frontend/educhat
npm install
npm run dev
```

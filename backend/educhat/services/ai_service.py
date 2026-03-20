from groq import Groq
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SYSTEM_PROMPT = {
    "maths": "You are a mathematics AI assistant. Explain things simply and step by step.",
    "physique": "You are a physics AI assistant. Explain things simply and step by step.",
    "chimie": "You are a chemistry AI assistant. Explain things simply and step by step.",
    "svt": "You are a biology AI assistant. Explain things simply and step by step.",
    "histoire": "You are a history AI assistant. Explain things simply and step by step.",
    "geographie": "You are a geography AI assistant. Explain things simply and step by step."
}

LEVEL_CONTEXT = {
    "college":     "The student is in middle school (college). Use very simple language, basic examples, and avoid complex formulas.",
    "lycee":       "The student is in high school (lycee). You can use intermediate concepts and standard formulas.",
    "universite":  "The student is at university level. You can use advanced concepts, proofs, and technical language."
}

DEFAULT_PROMPT = "You are an educational AI assistant. Explain things simply and step by step."

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_ai_response(messages, subject=None, level=None):

    # System prompt selon la matière
    subject_prompt = SYSTEM_PROMPT.get(subject, DEFAULT_PROMPT) if subject else DEFAULT_PROMPT

    # Contexte selon le niveau scolaire
    level_context = LEVEL_CONTEXT.get(level, "") if level else ""

    # Fusion des deux
    full_system_prompt = f"{subject_prompt} {level_context}".strip()

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": full_system_prompt},
            *messages
        ],
        model="llama-3.1-8b-instant"
    )

    response = chat_completion.choices[0].message.content
    tokens = chat_completion.usage.total_tokens  # ✅ récupère les tokens consommés

    return response, tokens


SUBJECT_KEYWORDS = {
    "maths": ["equation", "derivee", "integrale", "algebre", "geometrie", "triangle", "calcul", "nombre", "fraction", "polynome", "vecteur", "matrice", "probabilite", "statistique", "theoreme", "pythagore", "perimetre", "aire", "volume", "fonction", "limite", "suite"],
    "physique": ["force", "vitesse", "acceleration", "energie", "masse", "gravite", "electricite", "courant", "tension", "resistance", "lumiere", "onde", "frequence", "quantum", "newton", "joule", "watt", "circuit", "champ", "magnetique"],
    "chimie": ["molecule", "atome", "element", "reaction", "acide", "base", "oxyde", "sel", "ion", "electron", "proton", "neutron", "tableau periodique", "liaison", "solution", "concentration", "mole", "formule chimique"],
    "histoire": ["guerre", "revolution", "empire", "roi", "siecle", "civilisation", "antiquite", "moyen age", "renaissance", "colonisation", "independance", "traite", "bataille", "president", "republique"],
    "geographie": ["continent", "pays", "capitale", "fleuve", "montagne", "ocean", "mer", "population", "climat", "relief", "frontiere", "carte", "territoire", "region", "ville"],
    "svt": ["cellule", "adn", "gene", "evolution", "photosynthese", "ecosysteme", "biodiversite", "organisme", "virus", "bacterie", "anatomie", "biologie", "plante", "animal"]
}

def detect_subject(message):
    message_lower = message.lower()
    scores = {}
    for subject, keywords in SUBJECT_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in message_lower)
        if score > 0:
            scores[subject] = score
    if scores:
        return max(scores, key=scores.get)
    return None


def generate_chat_title(message):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un assistant qui génère des titres courts et pertinents pour des conversations. Génère UNIQUEMENT un titre de 3 à 6 mots maximum, sans ponctuation, sans guillemets, sans explication. Juste le titre."
                },
                {
                    "role": "user",
                    "content": f"Génère un titre court pour cette question : {message}"
                }
            ],
            model="llama-3.1-8b-instant",
            max_tokens=20
        )
        title = chat_completion.choices[0].message.content.strip()
        # Limite à 40 caractères par sécurité
        return title[:40]
    except Exception:
        # En cas d'erreur retourne les premiers mots du message
        return message[:30]
from groq import Groq
import os
import re
from dotenv import load_dotenv

load_dotenv()

SYSTEM_PROMPT = {
    "maths": "Tu es un assistant éducatif spécialisé en mathématiques.",
    "physique": "Tu es un assistant éducatif spécialisé en physique.",
    "chimie": "Tu es un assistant éducatif spécialisé en chimie.",
    "svt": "Tu es un assistant éducatif spécialisé en SVT et biologie.",
    "histoire": "Tu es un assistant éducatif spécialisé en histoire.",
    "geographie": "Tu es un assistant éducatif spécialisé en géographie."
}

LEVEL_CONTEXT = {
    "college": "L'élève est au collège. Utilise un langage très simple, des exemples concrets et évite les formules complexes.",
    "lycee": "L'élève est au lycée. Tu peux utiliser des concepts intermédiaires et des formules standard.",
    "universite": "L'étudiant est à l'université. Tu peux utiliser des concepts avancés et un langage technique."
}

FORMATTING_RULES = """
REGLES DE FORMATAGE STRICTES :
- Réponds toujours en français
- N'utilise jamais de markdown : pas de **, *, #, _, `, ~
- N'utilise jamais de caractères spéciaux inutiles
- Pour les listes, utilise uniquement des tirets simples : -
- Pour les étapes numérotées, utilise : 1. 2. 3.
- Pour les titres de section, écris en majuscules simples : DEFINITION, EXEMPLE, METHODE
- Sépare les sections par une ligne vide
- Sois clair, concis et pédagogique
"""

DEFAULT_PROMPT = "Tu es un assistant éducatif. Explique les choses simplement et étape par étape."

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def clean_response(text):
    # Supprimer le gras et l'italique markdown
    text = re.sub(r'\*{1,3}(.*?)\*{1,3}', r'\1', text, flags=re.DOTALL)
    # Supprimer les titres markdown
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    # Supprimer les backticks inline et blocs de code
    text = re.sub(r'`{1,3}.*?`{1,3}', '', text, flags=re.DOTALL)
    # Supprimer le soulignement markdown
    text = re.sub(r'_{1,2}(.*?)_{1,2}', r'\1', text, flags=re.DOTALL)
    # Supprimer le barré markdown
    text = re.sub(r'~~(.*?)~~', r'\1', text, flags=re.DOTALL)
    # Normaliser les tirets de liste
    text = re.sub(r'^\s*[-*+]\s+', '- ', text, flags=re.MULTILINE)
    # Supprimer les lignes horizontales
    text = re.sub(r'^[-*_]{3,}$', '', text, flags=re.MULTILINE)
    # Supprimer les espaces multiples
    text = re.sub(r' {2,}', ' ', text)
    # Supprimer les sauts de ligne excessifs
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def generate_ai_response(messages, subject=None, level=None):
    subject_prompt = SYSTEM_PROMPT.get(subject, DEFAULT_PROMPT) if subject else DEFAULT_PROMPT
    level_context = LEVEL_CONTEXT.get(level, "") if level else ""
    full_system_prompt = f"{subject_prompt}\n{level_context}\n{FORMATTING_RULES}".strip()

    chat_completion = client.chat.completions.create(
        messages=[
            {"role": "system", "content": full_system_prompt},
            *messages
        ],
        model="openai/gpt-oss-20b"
    )

    response = chat_completion.choices[0].message.content
    tokens = chat_completion.usage.total_tokens
    cleaned = clean_response(response)

    return cleaned, tokens


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
        best_subject = max(scores, key=scores.get)
        best_score = scores[best_subject]
        # Minimum 2 mots-cles pour eviter les faux positifs
        # sur des questions de suivi courtes
        if best_score >= 2:
            return best_subject
    return None


def generate_chat_title(message):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Tu es un assistant qui génère des titres courts. Génère UNIQUEMENT un titre de 3 à 6 mots maximum, sans ponctuation, sans guillemets, sans explication. Juste le titre."
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
        return title[:40]
    except Exception:
        return message[:30]
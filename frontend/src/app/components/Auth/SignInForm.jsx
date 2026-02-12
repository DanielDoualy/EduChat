import InputField from "@/app/components/Auth/InputField";
import "@/app/styles/auth.css"

export default function SignInForm() {
  return (
    <div className="auth-card">
      <h2 className="mb-4">Inscrivez vous</h2>

      <InputField label="Nom" placeholder="Entrer votre nom"  />
      <InputField label="Niveau" placeholder="Entrer votre niveau scolaire" />
      <InputField label="Email" placeholder="Entrer votre adresse email" />
      <InputField label="Mot de passe" placeholder="Entrer votre mot de passe" type="password" />

      <button className="btn auth-button w-100 mt-3">
        S’inscrire
      </button>
    </div>
  );
}

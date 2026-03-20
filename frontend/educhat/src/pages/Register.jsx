import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import InputField from "../components/InputField"
import { api } from "../services/api"
import "../styles/auth.css"

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [level, setLevel] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            const response = await api.register({
                first_name: firstName,
                last_name: lastName,
                level,
                email,
                password,
                username: userName
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.detail || "Erreur lors de l'inscription")
                return
            }

            navigate("/login")
        } catch {
            setError("Impossible de se connecter au serveur")
        }
    }

    return (
        <div className="register-page">
            <h1 className="logo">EduChat</h1>
            <div className="register-wrapper">
                <div className="register-div">
                    <h2>S'inscrire</h2>

                    {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}

                    <InputField
                        label="Nom"
                        placeholder="Entrer votre nom"
                        className="last-name"
                        name="lastname"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <InputField
                        label="Prenoms"
                        placeholder="Entrer votre prenoms"
                        className="first-name"
                        name="firstname"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    <InputField
                        label="Niveau"
                        placeholder="Entrer votre niveau academique"
                        className="level"
                        name="level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    />

                    <InputField
                        label="Email"
                        type="email"
                        placeholder="Entrer votre email"
                        className="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <InputField
                        label="Mot de passe"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <InputField
                        label="Nom d'utilisateur"
                        placeholder="Entrez votre nom d'utilisateur"
                        className="username"
                        name="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />

                    <Button
                        text="Inscription"
                        type="button"
                        className="send-button"
                        onClick={handleRegister}
                    />
                </div>
            </div>
        </div>
    )
}
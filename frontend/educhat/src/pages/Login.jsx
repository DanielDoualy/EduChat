import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import InputField from "../components/InputField"
import { api } from "../services/api"
import "../styles/auth.css"

export default function Login() {
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogin = async () => {
        if (loading) return
        setLoading(true)
        setError("")

        try {
            const response = await api.login({ username: userName, password })
            const result = await response.json()

            if (!response.ok) {
                setError("Nom d'utilisateur ou mot de passe incorrect")
                setLoading(false)
                return
            }

            localStorage.setItem("token", result.access)

            const profileResponse = await api.profile(result.access)
            const profileData = await profileResponse.json()

            localStorage.setItem("username", profileData.username)
            localStorage.setItem("level", profileData.level)

            navigate("/chat")
        } catch {
            setError("Impossible de se connecter au serveur")
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin()
    }

    return (
        <div className="register-page">

            {loading && (
                <div className="page-loading-overlay">
                    <div className="page-loading-spinner" />
                    <p className="page-loading-text">Connexion en cours...</p>
                </div>
            )}

            <h1 className="logo">EduChat</h1>
            <div className="register-wrapper">
                <div className="register-div">
                    <h2>Se connecter</h2>

                    {error && <p className="error-message">{error}</p>}

                    <InputField
                        label="Nom d'utilisateur"
                        placeholder="Entrez votre nom d'utilisateur"
                        className="username"
                        name="username"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <InputField
                        label="Mot de passe"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <Button
                        text={
                            loading ? (
                                <span>
                                    <span className="btn-spinner" />
                                    Connexion...
                                </span>
                            ) : "Connexion"
                        }
                        type="button"
                        className="send-button"
                        onClick={handleLogin}
                    />
                </div>
            </div>
        </div>
    )
}
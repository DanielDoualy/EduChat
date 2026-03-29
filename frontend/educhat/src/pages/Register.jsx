import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import InputField from "../components/InputField"
import { api } from "../services/api"
import "../styles/auth.css"

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [level, setLevel] = useState("college")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleRegister = async () => {
        if (loading) return
        setLoading(true)
        setError("")

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
                const firstError = Object.values(result)[0]
                setError(Array.isArray(firstError) ? firstError[0] : firstError)
                setLoading(false)
                return
            }

            const loginResponse = await api.login({ username: userName, password })
            const loginResult = await loginResponse.json()

            if (loginResponse.ok) {
                // Sauvegarder les deux tokens
                localStorage.setItem("token", loginResult.access)
                localStorage.setItem("refresh_token", loginResult.refresh)

                const profileResponse = await api.profile(loginResult.access)
                const profileData = await profileResponse.json()
                localStorage.setItem("username", profileData.username)
                localStorage.setItem("level", profileData.level)
                navigate("/chat")
            } else {
                navigate("/login")
            }

        } catch {
            setError("Impossible de se connecter au serveur")
            setLoading(false)
        }
    }

    return (
        <div className="register-page">

            {loading && (
                <div className="page-loading-overlay">
                    <div className="page-loading-spinner" />
                    <p className="page-loading-text">Création du compte...</p>
                </div>
            )}

            <h1 className="logo">EduChat</h1>
            <div className="register-wrapper">
                <div className="register-div">
                    <h2>S'inscrire</h2>

                    {error && <p className="error-message">{error}</p>}

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

                    <div className="form-group">
                        <label><strong>Niveau</strong></label>
                        <select
                            className="level"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            <option value="college">College</option>
                            <option value="lycee">Lycee</option>
                            <option value="universite">Universite</option>
                        </select>
                    </div>

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
                        text={
                            loading ? (
                                <span>
                                    <span className="btn-spinner" />
                                    Inscription...
                                </span>
                            ) : "Inscription"
                        }
                        type="button"
                        className="send-button"
                        onClick={handleRegister}
                    />
                </div>
            </div>
        </div>
    )
}
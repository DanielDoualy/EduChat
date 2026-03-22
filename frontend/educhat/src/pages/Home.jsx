import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import "../styles/home.css"
import botIcon from "../assets/dark_bot_icon.svg"
import mathIcon from "../assets/math_icon.svg"
import physicsIcon from "../assets/physics_icon.svg"
import svtIcon from "../assets/leaf_icon.svg"
import chimieIcon from "../assets/chimie_icon.svg"
import historyIcon from "../assets/history_icon.svg"
import geoIcon from "../assets/geography_icon.svg"

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="home-page">

            <div className="home-header">
                <h1 className="home-logo">EduChat</h1>
            </div>

            <div className="home-content">

                <div className="home-hero">
                    <img src={botIcon} alt="bot" className="home-bot-icon" />
                    <h2 className="home-title">Bienvenue sur EduChat</h2>
                    <p className="home-subtitle">
                        Votre assistant éducatif intelligent pour apprendre à votre rythme
                    </p>
                </div>

                <div className="home-subjects">
                    <div className="home-subject-item">
                        <img src={mathIcon} alt="maths" />
                        <span>Maths</span>
                    </div>
                    <div className="home-subject-item">
                        <img src={physicsIcon} alt="physique" />
                        <span>Physique</span>
                    </div>
                    <div className="home-subject-item">
                        <img src={svtIcon} alt="svt" />
                        <span>SVT</span>
                    </div>
                    <div className="home-subject-item">
                        <img src={chimieIcon} alt="chimie" />
                        <span>Chimie</span>
                    </div>
                    <div className="home-subject-item">
                        <img src={historyIcon} alt="histoire" />
                        <span>Histoire</span>
                    </div>
                    <div className="home-subject-item">
                        <img src={geoIcon} alt="geographie" />
                        <span>Géographie</span>
                    </div>
                </div>

                <div className="home-actions">
                    <Button
                        text="S'inscrire"
                        type="button"
                        className="home-btn home-btn--primary"
                        onClick={() => navigate("/register")}
                    />
                    <Button
                        text="Se connecter"
                        type="button"
                        className="home-btn home-btn--secondary"
                        onClick={() => navigate("/login")}
                    />
                </div>

            </div>

        </div>
    )
}
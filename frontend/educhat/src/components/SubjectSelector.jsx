import mathIcon from "../assets/math_icon.svg"
import physicsIcon from "../assets/physics_icon.svg"
import chimieIcon from "../assets/chimie_icon.svg"
import historyIcon from "../assets/history_icon.svg"
import geoIcon from "../assets/geography_icon.svg"
import svtIcon from "../assets/leaf_icon.svg"

const SUBJECTS = [
    { id: "maths",      label: "Maths",      icon: mathIcon },
    { id: "physique",   label: "Physique",   icon: physicsIcon },
    { id: "svt",        label: "SVT",        icon: svtIcon },
    { id: "chimie",     label: "Chimie",     icon: chimieIcon },
    { id: "histoire",   label: "Histoire",   icon: historyIcon },
    { id: "geographie", label: "Geographie", icon: geoIcon },
]

export default function SubjectSelector({ onSelect, currentSubject }) {
    return (
        <div className="subject-selector">
            {SUBJECTS.map(subject => (
                <div
                    key={subject.id}
                    className={`subject-item ${currentSubject === subject.id ? "subject-item--active" : ""}`}
                    onClick={() => onSelect(subject.id)}
                >
                    <span>{subject.label}</span>
                    <img src={subject.icon} alt={subject.label} className="subject-icon" />
                </div>
            ))}
        </div>
    )
}
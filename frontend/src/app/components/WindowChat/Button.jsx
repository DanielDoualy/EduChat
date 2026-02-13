export default function Button({ type = 'submit', label, className = '', icon }) {
    return (
        <button 
            type={type} 
            className={`btn ${className}`}
        >
            {label}
            {icon && <span className="ms-2">{icon}</span>}
        </button>
    );
}
export default function InputMessage({ value, onChange, placeholder = "Poser une question", onKeyPress }) {
    return (
        <input 
            type="text"
            className="form-control rounded-pill px-4"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            style={{
                backgroundColor: 'white',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                height: '60px',  // ✅ AJOUTÉ : hauteur de 60px (plus grand qu'avant)
                fontSize: '15px',  // ✅ AJOUTÉ : texte légèrement plus grand
                paddingLeft: '24px',  // ✅ AJOUTÉ : plus d'espace intérieur
                paddingRight: '24px'
            }}
        />
    );
}
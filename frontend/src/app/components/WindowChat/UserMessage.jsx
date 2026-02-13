import Icon from '../Icon';

export default function UserMessage({ message = "Donnez-moi la formule du périmètre d'un cercle" }) {
    return (
        <div className="d-flex flex-column align-items-end mb-4">
            {/* Bulle verte */}
            <div 
                className="bg-success text-white p-3 rounded-4 mb-2"
                style={{ 
                    maxWidth: '70%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
            >
                {message}
            </div>
            
            {/* Logo utilisateur en dessous */}
            <div 
                className="rounded-circle bg-white d-flex align-items-center justify-content-center" 
                style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '2px solid #000',
                    flexShrink: 0
                }}
            >
                <Icon name="user" size={24} />
            </div>
        </div>
    );
}
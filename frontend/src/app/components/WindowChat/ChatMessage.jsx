import Icon from '../Icon';

export default function ChatMessage({ message, isUser }) {
    return (
        <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
            {/* Avatar du bot (à gauche) */}
            {!isUser && (
                <div className="me-2">
                    <div 
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center" 
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            border: '2px solid #e0e0e0',
                            flexShrink: 0
                        }}
                    >
                        <Icon name="bot" size={24} />
                    </div>
                </div>
            )}
            
            {/* Bulle de message */}
            <div 
                className={`p-3 rounded-4 ${isUser ? 'bg-success text-white' : 'bg-white'}`}
                style={{ 
                    maxWidth: '70%',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}
            >
                {message}
            </div>

            {/* Avatar de l'utilisateur (à droite) */}
            {isUser && (
                <div className="ms-2">
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
            )}
        </div>
    );
}
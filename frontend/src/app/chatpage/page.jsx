'use client'
import { useState } from 'react';
import Sidebar from '@/app/components/WindowChat/Sidebar';
import ChatMessage from '@/app/components/WindowChat/ChatMessage';
import SubjectPills from '@/app/components/WindowChat/SubjectPills';
import UserMessage from '@/app/components/WindowChat/UserMessage';
import InputMessage from '@/app/components/WindowChat/InputMessage';
import Icon from '@/app/components/Icon';

export default function Page() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
            setMessages([...messages, { text: inputValue, isUser: true }]);
            setInputValue('');
            
            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    text: "Je traite votre demande...", 
                    isUser: false 
                }]);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="d-flex" style={{ height: '100vh', backgroundColor: '#e8e8e8' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Zone principale du chat */}
            <div 
                className="flex-grow-1" 
                style={{ 
                    marginLeft: '350px',
                    display: 'flex', 
                    flexDirection: 'column' 
                }}
            >
                {/* Header */}
                <div className="p-4">
                    <h1 className="fw-bold mb-4" style={{ fontSize: '32px' }}>EduChat</h1>
                    <SubjectPills />
                    
                    {/* Espacement entre badges et messages */}
                    <div style={{ marginTop: '40px' }}>
                        {/* Message du BOT */}
                        <div className="mb-3">
                            <ChatMessage 
                                message="Bonjour en quoi puis-je vous aider ?" 
                                isUser={false} 
                            />
                        </div>
                        
                        {/* Message de l'UTILISATEUR */}
                        <UserMessage message="Donnez-moi la formule du périmètre d'un cercle" />
                    </div>
                </div>

                {/* Zone des messages dynamiques */}
                <div 
                    className="flex-grow-1 px-5 overflow-auto" 
                    id="messages-container"
                    style={{ marginBottom: '100px' }}
                   
                >
                    {messages.map((msg, index) => (
                        <ChatMessage 
                            key={index} 
                            message={msg.text} 
                            isUser={msg.isUser} 
                        />
                    ))}
                </div>

                {/* ✅ Zone de saisie - POSITION FIXE EN BAS MAIS REMONTÉE */}
                <div 
                    className="px-4" 
                    style={{ 
                        paddingBottom: '30px',  // ✅ Plus d'espace en bas de la page
                        paddingTop: '0px',  // ✅ Pas d'espace en haut
                        position: 'relative',
                        bottom: '0'
                    }}
                >
                    <div 
                        className="d-flex gap-3 align-items-center" 
                        style={{ maxWidth: '1000px', margin: '0 auto' }}
                    >
                        <div className="flex-grow-1">
                            <InputMessage 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Poser une question"
                            />
                        </div>
                        
                        <button 
                            className="btn btn-success rounded-pill d-flex align-items-center gap-2 fw-medium"
                            onClick={handleSend}
                            style={{
                                transition: 'all 0.3s ease',
                                height: '60px',
                                paddingLeft: '28px',
                                paddingRight: '28px',
                                fontSize: '15px'
                            }}
                        >
                            <span>Envoyer</span>
                            <Icon name="send" size={20} className="filter-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
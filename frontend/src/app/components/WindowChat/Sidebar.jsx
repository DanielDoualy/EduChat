'use client'
import { useState } from 'react';
import Icon from '../Icon';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    
    const chatHistory = [
        { id: 1, name: 'Chat1' },
        { id: 2, name: 'Chat2' },
        { id: 3, name: 'Chat3' }
    ];

    return (
        <>
            {/* Sidebar */}
            <div 
                className="sidebar"
                style={{
                    width: '350px',
                    height: '100vh',
                    backgroundColor: '#3a3a3a',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    padding: '20px',
                    overflowY: 'auto',
                    transition: 'transform 0.3s ease',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header avec boutons - SANS icône hamburger */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    {/* Bouton Nouveau chat */}
                    <button 
                        className="btn btn-success rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                        style={{
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Icon name="plus" size={16} className="filter-white" />
                        <span className="fw-medium">Nouveau chat</span>
                    </button>
                    
                    {/* Bouton sidebar (fermeture) */}
                    <button 
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center border-0" 
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            backgroundColor: '#5a5a5a',
                            transition: 'background-color 0.2s',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6a6a6a'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#5a5a5a'}
                    >
                        <Icon name="sidebar" size={20} className="filter-white" />
                    </button>
                </div>

                {/* Titre Historique */}
                <h6 className="text-white-50 mb-3 ms-2 fw-normal">Historique</h6>

                {/* Liste des chats */}
                <div className="d-flex flex-column gap-2 flex-grow-1" style={{ overflowY: 'auto' }}>
                    {chatHistory.map(chat => (
                        <div 
                            key={chat.id}
                            className="d-flex align-items-center justify-content-between p-3 rounded chat-item"
                            style={{
                                backgroundColor: '#4a4a4a',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a5a5a'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a4a4a'}
                        >
                            <div className="d-flex align-items-center gap-2">
                                <Icon name="chat" size={18} className="filter-white" />
                                <span className="text-white">{chat.name}</span>
                            </div>
                            
                            <button 
                                className="p-1 border-0 d-flex align-items-center justify-content-center"
                                style={{
                                    backgroundColor: 'transparent',
                                    cursor: 'pointer',
                                    minWidth: '24px',
                                    minHeight: '24px'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Menu clicked for', chat.name);
                                }}
                            >
                                <Icon name="horizontal_ellipsis" size={20} className="filter-white" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Bouton utilisateur en bas */}
                <div 
                    className="mt-3 p-3 rounded d-flex align-items-center gap-3"
                    style={{
                        backgroundColor: '#4a4a4a',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a5a5a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4a4a4a'}
                >
                    <div 
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{ 
                            width: '40px', 
                            height: '40px',
                            backgroundColor: '#5a5a5a',
                            flexShrink: 0
                        }}
                    >
                        <Icon name="user" size={24} className="filter-white" />
                    </div>
                    
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                        <div 
                            className="text-white fw-medium" 
                            style={{ 
                                fontSize: '14px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Utilisateur
                        </div>
                        <div 
                            className="text-white-50" 
                            style={{ 
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            utilisateur@email.com
                        </div>
                    </div>
                    
                    <button 
                        className="p-1 border-0 d-flex align-items-center justify-content-center"
                        style={{
                            backgroundColor: 'transparent',
                            cursor: 'pointer',
                            minWidth: '24px',
                            minHeight: '24px'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('User menu clicked');
                        }}
                    >
                        <Icon name="horizontal_ellipsis" size={20} className="filter-white" />
                    </button>
                </div>
            </div>
        </>
    );
}
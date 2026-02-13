'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from './components/Icon';

export default function Home() {
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Déclenche les animations au chargement
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    const navigateTo = (path) => {
        router.push(path);
    };

    return (
        <div 
            style={{
                minHeight: '100vh',
                backgroundColor: '#e8e8e8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div 
                className="container"
                style={{
                    maxWidth: '900px'
                }}
            >
                {/* En-tête avec animation */}
                <div 
                    className={`text-center mb-5 ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'}`}
                    style={{
                        animationDelay: '0.1s'
                    }}
                >
                    <h1 
                        className="fw-bold mb-3"
                        style={{
                            fontSize: '56px',
                            color: '#000',
                            letterSpacing: '-1px'
                        }}
                    >
                        EduChat
                    </h1>
                    <p 
                        style={{
                            fontSize: '20px',
                            color: '#666',
                            maxWidth: '600px',
                            margin: '0 auto'
                        }}
                    >
                        Votre assistant éducatif intelligent pour les mathématiques, la physique et les SVT
                    </p>
                </div>

                {/* Cartes de matières avec animations */}
                <div 
                    className={`d-flex flex-wrap gap-3 justify-content-center mb-5 ${isLoaded ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{
                        animationDelay: '0.3s'
                    }}
                >
                    {/* Badge Mathématiques */}
                    <div 
                        className="btn btn-secondary rounded-pill px-4 py-3 d-flex align-items-center gap-2"
                        style={{
                            fontSize: '16px',
                            cursor: 'default',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Icon name="calculator" size={24} className="filter-white" />
                        <span className="fw-medium">Mathématiques</span>
                    </div>

                    {/* Badge Physiques */}
                    <div 
                        className="btn btn-secondary rounded-pill px-4 py-3 d-flex align-items-center gap-2"
                        style={{
                            fontSize: '16px',
                            cursor: 'default',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Icon name="atom" size={24} />
                        <span className="fw-medium">Physiques</span>
                    </div>

                    {/* Badge SVT */}
                    <div 
                        className="btn btn-secondary rounded-pill px-4 py-3 d-flex align-items-center gap-2"
                        style={{
                            fontSize: '16px',
                            cursor: 'default',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Icon name="leaf" size={24} />
                        <span className="fw-medium">SVT</span>
                    </div>
                </div>

                {/* Carte principale avec animation */}
                <div 
                    className={`bg-white rounded-4 p-5 shadow-lg ${isLoaded ? 'animate-scale-in' : 'opacity-0'}`}
                    style={{
                        animationDelay: '0.5s',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}
                >
                    <div className="text-center mb-4">
                        <div 
                            className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center mb-3"
                            style={{
                                width: '80px',
                                height: '80px'
                            }}
                        >
                            <Icon name="bot" size={48} className="filter-white" />
                        </div>
                        <h2 className="fw-bold mb-2" style={{ fontSize: '28px' }}>
                            Bienvenue sur EduChat
                        </h2>
                        <p className="text-muted" style={{ fontSize: '16px' }}>
                            Commencez votre apprentissage dès maintenant
                        </p>
                    </div>

                    {/* Boutons de navigation avec animations */}
                    <div className="d-flex flex-column gap-3">
                        {/* Bouton Commencer le chat */}
                        <button
                            onClick={() => navigateTo('/chatpage')}
                            className="btn btn-success rounded-pill py-3 d-flex align-items-center justify-content-center gap-2 fw-medium animate-button"
                            style={{
                                fontSize: '18px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <Icon name="chat" size={24} className="filter-white" />
                            <span>Commencer le chat</span>
                        </button>

                        {/* Séparateur */}
                        <div className="d-flex align-items-center gap-3 my-2">
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                            <span className="text-muted" style={{ fontSize: '14px' }}>ou</span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#ddd' }}></div>
                        </div>

                        {/* Boutons Inscription et Connexion */}
                        <div className="d-flex gap-3">
                            <button
                                onClick={() => navigateTo('/register')}
                                className="btn btn-outline-success rounded-pill py-3 flex-grow-1 fw-medium animate-button"
                                style={{
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    borderWidth: '2px'
                                }}
                            >
                                Inscription
                            </button>

                            <button
                                onClick={() => navigateTo('/login')}
                                className="btn btn-outline-secondary rounded-pill py-3 flex-grow-1 fw-medium animate-button"
                                style={{
                                    fontSize: '16px',
                                    transition: 'all 0.3s ease',
                                    borderWidth: '2px'
                                }}
                            >
                                Connexion
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer avec animation */}
                <div 
                    className={`text-center mt-5 ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}
                    style={{
                        animationDelay: '0.7s'
                    }}
                >
                    <p className="text-muted" style={{ fontSize: '14px' }}>
                        Propulsé par intelligence artificielle • EduChat 2026
                    </p>
                </div>
            </div>

            {/* Styles CSS pour les animations */}
            <style jsx global>{`
                .opacity-0 {
                    opacity: 0;
                }

                /* Animation fade-in-down */
                @keyframes fadeInDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-down {
                    animation: fadeInDown 0.8s ease-out forwards;
                }

                /* Animation fade-in-up */
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }

                /* Animation scale-in */
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out forwards;
                }

                /* Animation fade-in */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                /* Effet hover sur les boutons */
                .animate-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                .animate-button:active {
                    transform: translateY(-1px);
                }

                /* Effet de brillance sur la carte */
                .shadow-lg {
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                }

                .shadow-lg:hover {
                    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
                    transition: box-shadow 0.3s ease;
                }
            `}</style>
        </div>
    );
}
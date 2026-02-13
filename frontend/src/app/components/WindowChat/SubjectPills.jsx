'use client'
import { useState } from 'react';
import Icon from '../Icon';

export default function SubjectPills() {
    const [activeSubject, setActiveSubject] = useState('Mathematiques');
    
    const subjects = [
        { name: 'Mathematiques', icon: 'calculator' },
        { name: 'Physiques', icon: 'atom' },
        { name: 'SVT', icon: 'leaf' }
    ];

    return (
        <div className="d-flex gap-3 mb-4 flex-wrap">
            {/* ✅ CHANGÉ : Retiré justify-content-center, alignement naturel à gauche */}
            {subjects.map((subject) => (
                <button
                    key={subject.name}
                    onClick={() => setActiveSubject(subject.name)}
                    className={`btn rounded-pill px-4 py-2 d-flex align-items-center gap-2 fw-medium ${
                        activeSubject === subject.name ? 'btn-success' : 'btn-secondary'
                    }`}
                    style={{
                        transition: 'all 0.3s ease'
                    }}
                >
                    {subject.name}
                    <Icon 
                        name={subject.icon} 
                        size={20} 
                        className={activeSubject === subject.name ? 'filter-white' : ''} 
                    />
                </button>
            ))}
        </div>
    );
}
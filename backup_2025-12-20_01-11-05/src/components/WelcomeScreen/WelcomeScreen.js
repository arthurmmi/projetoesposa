import React, { useState } from 'react';
// IMPORTAÇÃO CORRETA (SÓ O SEU PRÓPRIO CSS)
import './WelcomeScreen.css';

function WelcomeScreen({ onStartApp }) {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleStartClick = () => {
        setIsAnimating(true);
        setTimeout(() => {
            onStartApp();
        }, 1000);
    };

    return (
        <div className={`welcome-container ${isAnimating ? 'fade-out' : ''}`}>
            <div className="ocean-background"></div>

            <button
                className="neon-button"
                onClick={handleStartClick}
                disabled={isAnimating}
            >
                <span role="img" aria-label="coração">💙</span>
                CLIQUE PARA MERGULHAR
            </button>

            <p className="welcome-message-hint">Bem-vinda, meu amor!</p>
        </div>
    );
}

export default WelcomeScreen;
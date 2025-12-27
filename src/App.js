import React, { useState } from 'react';

// 🚨 1. Importar o BrowserRouter aqui. Ele é o "motor" da navegação.
import { BrowserRouter } from 'react-router-dom';

// Importando os componentes (Seus caminhos originais)
import WelcomeScreen from './components/WelcomeScreen/WelcomeScreen';
import MainAppContent from './components/MainAppContent/MainAppContent';

// Importando o CSS global
import './App.css';

function App() {
  // Sua lógica original de estado continua intacta
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStartApp = () => {
    setShowWelcome(false);
  };

  return (
      // 🚨 2. Envelopamos TUDO com o BrowserRouter.
      // Isso permite que qualquer componente lá dentro (como o VisitedPlaces) use o botão de voltar.
      <BrowserRouter>
        <div className="App">
          {showWelcome ? (
              // Se showWelcome for verdadeiro, exibe a tela inicial
              <WelcomeScreen onStartApp={handleStartApp} />
          ) : (
              // Caso contrário (após clicar), exibe o menu principal
              <MainAppContent />
          )}
        </div>
      </BrowserRouter>
  );
}

export default App;
import React, { useState } from 'react';
import './RelationshipQuiz.css'; // Importa os estilos do Quiz

// 💖 PONTO DE EDIÇÃO 💖
// Edite as 10 perguntas, opções e qual é a resposta correta (isCorrect: true)
const quizQuestions = [
    {
        question: "Onde foi nosso primeiro beijo?",
        options: [
            { text: "No Apartamento", isCorrect: true },
            { text: "No Shopping", isCorrect: false },
            { text: "Na Prefeitura", isCorrect: false },
            { text: "Na Boa Vista", isCorrect: false },
        ],
    },
    {
        question: "Qual é a minha comida favorita que VOCÊ faz?",
        options: [
            { text: "(Frango empanado)", isCorrect: false },
            { text: "(macarrao com creme de leite)", isCorrect: false },
            { text: "Qualquer coisa, desde que seja feita por você!", isCorrect: true },
            { text: "(enroladinho de salsicha)", isCorrect: false },
        ],
    },
    {
        question: "Qual é o nome do nosso primeiro 'filho' (pet, planta, etc)?",
        options: [
            { text: "bulma", isCorrect: true },
            { text: "mart", isCorrect: false },
            { text: "mel", isCorrect: false },
            { text: "banguela", isCorrect: false },
        ],
    },
    {
        question: "qual a cor da camiseta que eu estava usando no nosso primeiro encontro?",
        options: [
            { text: "(branca)", isCorrect: false },
            { text: "(preta)", isCorrect: false },
            { text: "(cinza)", isCorrect: true },
            { text: "(azul)", isCorrect: false },
        ],
    },
    // --- NOVAS PERGUNTAS (PREENCHA!) ---
    {
        question: "Qual é o 'nosso' restaurante favorito?",
        options: [
            { text: "(texas pizzaria)", isCorrect: true },
            { text: "(Raffits)", isCorrect: false },
            { text: "(stop dog)", isCorrect: false },
            { text: "inbox", isCorrect: false },
        ],
    },
    {
        question: "que dia eu te pedi em namoro??",
        options: [
            { text: "(19/12/20)", isCorrect: false },
            { text: "(21/12/21)", isCorrect: true },
            { text: "(19/12/21)", isCorrect: false },
            { text: "(21/12/20)", isCorrect: false },
        ],
    },
    {
        question: "Qual foi o primeiro presente que eu te dei?",
        options: [
            { text: "(kit da oboticario)", isCorrect: true },
            { text: "(caneca, ursinho e porta copo)", isCorrect: false },
            { text: "(colar)", isCorrect: false },
            { text: "(a bulma)", isCorrect: false }, // Boa, mas talvez não a correta :P
        ],
    },
    {
        question: "Qual primeiro apelido que te dei?",
        options: [
            { text: "juju", isCorrect: false },
            { text: "mimadinha", isCorrect: true },
            { text: "jujubs", isCorrect: false },
            { text: "ju", isCorrect: false },
        ],
    },
    {
        question: "oque eu amo mais em voce?",
        options: [
            { text: "(tudo)", isCorrect: false },
            { text: "(Pepetao)", isCorrect: true },
            { text: "colinhoooooo)", isCorrect: false },
            { text: "seu sorriso)", isCorrect: false },
        ],
    },
    {
        question: "a resposta da questão anterior é tudo estava so brincando. Se eu nao fizesse ciencia da computação eu faria oque?",
        options: [
            { text: "nada", isCorrect: false },
            { text: "algum esporte", isCorrect: false },
            { text: "seria bandindin", isCorrect: false },
            { text: "neuro cirurgia", isCorrect: true }, // Resposta coringa!
        ],
    }
];
// 💖 FIM DA EDIÇÃO 💖


function RelationshipQuiz({ onBack }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState(''); // Feedback (Correto/Incorreto)
    const [selected, setSelected] = useState(false); // Trava o clique

    const handleAnswerClick = (isCorrect) => {
        setSelected(true); // Trava os botões
        if (isCorrect) {
            setScore(score + 1);
            setFeedback('Correto! Você me conhece mesmo! ❤️');
        } else {
            setFeedback('Ops! Quase lá, mas não era essa.');
        }

        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < quizQuestions.length) {
                setCurrentQuestion(nextQuestion);
            } else {
                setShowResult(true);
            }
            setFeedback('');
            setSelected(false); // Destrava os botões
        }, 1500);
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setFeedback('');
    };

    return (
        <div className="module-container quiz-container">
            {showResult ? (
                // Tela de Resultado
                <div className="quiz-result">
                    <h2 className="quiz-title">Quiz Concluído, Meu Amor!</h2>
                    <p className="result-score">Você acertou {score} de {quizQuestions.length} perguntas!</p>
                    <p className="result-message">
                        {score === quizQuestions.length
                            ? "Incrível! Você acertou tudo! 💖 Sabe tudo sobre nós!"
                            : "Você foi ótima! O importante é que cada dia aprendemos mais um sobre o outro."}
                    </p>
                    {/* Botões de Ação Centralizados */}
                    <div className="quiz-button-group">
                        <button className="module-button" onClick={restartQuiz}>Tentar Novamente</button>
                        <button className="module-button" onClick={onBack}>Voltar ao Menu</button>
                    </div>
                </div>
            ) : (
                // Tela da Pergunta
                <>
                    <h2 className="quiz-title">Nosso Quiz Especial</h2>
                    <div className="quiz-question-container">
                        <p className="quiz-question-number">Pergunta {currentQuestion + 1} de {quizQuestions.length}</p>
                        <p className="quiz-question">{quizQuestions[currentQuestion].question}</p>
                    </div>

                    <div className="quiz-options">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                className={`quiz-option ${selected ? (option.isCorrect ? 'correct' : 'incorrect') : ''}`}
                                onClick={() => handleAnswerClick(option.isCorrect)}
                                disabled={selected} // Desabilita botões após clique
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>

                    {/* Feedback Centralizado */}
                    {feedback && <p className="quiz-feedback">{feedback}</p>}

                    {/* Botão Sair Centralizado */}
                    <div className="quiz-button-group">
                        <button className="module-button back-button" onClick={onBack}>Sair do Quiz</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default RelationshipQuiz;
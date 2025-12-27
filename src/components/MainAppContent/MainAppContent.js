import React, { useState, useRef, useEffect } from 'react';
import './MainAppContent.css';

// --- IMPORTAÇÃO DOS MODULOS ---
import RelationshipQuiz from '../RelationshipQuiz/RelationshipQuiz';
import VisitedPlaces from '../VisitedPlaces/VisitedPlaces';
import TravelIdeas from '../TravelIdeas/TravelIdeas';
import FinancialGoals from '../FinancialGoals/FinancialGoals';

// --- IMPORTAÇÃO DAS FOTOS E VÍDEOS ---
import foto1 from '../fotos/foto1.jpg';
import foto2 from '../fotos/foto2.jpeg';
import foto3 from '../fotos/foto3.jpeg';
import foto4 from '../fotos/foto4.jpeg';
import video5 from '../fotos/video5.mp4';
import foto6 from '../fotos/foto6.jpeg';
import foto7 from '../fotos/foto7.jpeg';
import foto8 from '../fotos/foto8.jpeg';
import foto9 from '../fotos/foto9.jpeg';
import foto10 from '../fotos/foto10.jpeg';

function MainAppContent() {
    const [activeModule, setActiveModule] = useState('home');
    const [expandedSections, setExpandedSections] = useState({});

    // Novo estado para controlar quais seções estão "desbloqueadas" pelo barco
    const [unlockedSections, setUnlockedSections] = useState({});

    // Refs
    const timelineRef = useRef(null);
    const boatRef = useRef(null);
    const sectionRefs = useRef({}); // Mapa de refs para cada seção

    const toggleSection = (section) => {
        // Allow clicking anytime - also unlock when clicked
        setUnlockedSections(prev => ({ ...prev, [section]: true }));
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Função auxiliar para salvar ref das seções
    const setSectionRef = (el, id) => {
        if (el) sectionRefs.current[id] = el;
    };

    // Efeito para controlar o barquinho e IntersectionObserver
    useEffect(() => {
        const container = timelineRef.current;
        const boat = boatRef.current;

        if (activeModule === 'timeline' && container && boat) {
            // 1. LÓGICA DO BARCO (Loop Visual)
            // Em vez de depender só do evento 'scroll', usamos requestAnimationFrame
            // para garantir que o barco siga suave e não trave.
            let animationFrameId;

            const updateBoatPosition = () => {
                const scrollTop = container.scrollTop;
                const clientHeight = container.clientHeight;

                // Queremos que o barco fique sempre "navegando" no meio da tela (ou um pouco acima)
                // Posição absoluta no conteúdo = Scroll Atual + (Metade da Tela)
                // Assim ele parece estar parado na água enquanto o mundo passa.
                const targetY = scrollTop + (clientHeight * 0.2); // Fica nos 20% do topo visualmente

                // Aplicamos diretamente em pixels para máxima precisão
                boat.style.top = `${targetY}px`;

                animationFrameId = requestAnimationFrame(updateBoatPosition);
            };

            // Inicia o loop visual
            updateBoatPosition();

            // 2. OBSERVADOR DE DESBLOQUEIO (Lógica Logica)
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('data-year');
                        if (sectionId) {
                            setUnlockedSections(prev => ({ ...prev, [sectionId]: true }));
                        }
                    }
                });
            }, {
                root: container,
                threshold: 0.1, // Dispara com qualquer pontinha visível na zona
                rootMargin: "-15% 0px -50% 0px" // Zona mais segura: do topo (15%) até metade da tela
            });

            // Observa as seções
            Object.values(sectionRefs.current).forEach(el => {
                if (el) observer.observe(el);
            });

            return () => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId);
                observer.disconnect();
            };
        }
    }, [activeModule]);

    const renderModule = () => {
        switch (activeModule) {
            case 'timeline':
                return (
                    <div className="module-container timeline-container" ref={timelineRef}>
                        <h2 className="timeline-main-title">⭐ LINHA DO TEMPO — 4 ANOS DE NÓS</h2>
                        <h3 className="timeline-subtitle">Navegue para descobrir...</h3>

                        <div className="timeline-content">
                            <div className="timeline-line"></div>
                            <div className="timeline-boat" ref={boatRef}>⛵</div>

                            {/* --- SEÇÕES --- */}

                            {/* 2021 */}
                            <div className="timeline-year-section" data-year="2021" ref={el => setSectionRef(el, '2021')}>
                                <h4
                                    onClick={() => toggleSection('2021')}
                                    className={`clickable-header ${unlockedSections['2021'] ? 'unlocked' : 'locked'}`}
                                >
                                    {unlockedSections['2021'] ? (expandedSections['2021'] ? '📂' : '📁') : '🔒'}
                                    {unlockedSections['2021'] ? ' 🌙 2021 — Onde tudo começou' : ' ???'}
                                </h4>
                                {expandedSections['2021'] && unlockedSections['2021'] && (
                                    <div className="timeline-section-content">

                                        <div className="timeline-row">
                                            <div className="timeline-text-col">
                                                <p>Nos conhecemos através de um amigo, e foi no Discord que nossa amizade nasceu.</p>
                                                <p>A cada dia, conversar contigo parecia tão natural, tão leve… como se eu já te conhecesse há anos.</p>
                                                <p>Naquela época eu carregava as marcas de um relacionamento recente, e você enfrentava sua batalha contra a depressão. Mesmo assim, algo em nós dois florescia rápido. E então, um dia, você confessou que gostava de mim.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto1} className="timeline-photo" alt="Foto 1" />
                                            </div>
                                        </div>

                                        <div className="timeline-row reverse-layout">
                                            <div className="timeline-text-col">
                                                <p>Eu, com medo de te machucar, contei que ainda sentia algo confuso sobre meu passado, mas disse a verdade mais importante: <strong>eu queria algo contigo.</strong></p>
                                                <p>Nos encontramos no meu apartamento, e sem querer você conheceu minha família inteira. Foi ali que nos beijamos pela primeira vez. Eu tinha 17, você 16.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto2} className="timeline-photo" alt="Foto 2" />
                                            </div>
                                        </div>

                                        <div className="timeline-row">
                                            <div className="timeline-text-col">
                                                <p>Era final de novembro, começo de dezembro — e nossa vida estava prestes a mudar para sempre.</p>
                                                <p>Comprei um kit do Boticário e, com ajuda da minha irmã, nossas alianças. A data gravada: <strong>19/12/21</strong>.</p>
                                                <p>Eu ia te pedir em namoro na sua casa… mas minha vergonha venceu. Então veio o dia 21/12, o famoso filme do Homem-Aranha. Entramos no shopping e eu tremia. Mas os ingressos estavam esgotados.</p>
                                                <p>Fomos brincar nos carrinhos, comprar coisinhas, rir no Planet Game… até que, na praça de alimentação, criei coragem: <strong>te pedi em namoro.</strong></p>
                                                <p><em>(Eu sei… não foi o cenário mais romântico do mundo, mas foi verdadeiro.)</em></p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto3} className="timeline-photo" alt="Foto 3" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="timeline-divider" />

                            {/* 2022 */}
                            <div className="timeline-year-section" data-year="2022" ref={el => setSectionRef(el, '2022')}>
                                <h4
                                    onClick={() => toggleSection('2022')}
                                    className={`clickable-header ${unlockedSections['2022'] ? 'unlocked' : 'locked'}`}
                                >
                                    {unlockedSections['2022'] ? (expandedSections['2022'] ? '📂' : '📁') : '🔒'}
                                    {unlockedSections['2022'] ? ' 🏠 2022 — Vivendo Juntos' : ' ???'}
                                </h4>
                                {expandedSections['2022'] && unlockedSections['2022'] && (
                                    <div className="timeline-section-content">
                                        <div className="timeline-row">
                                            <div className="timeline-text-col">
                                                <p>Nunca mais desgrudamos. Íamos para o colégio juntos, você vinha para minha casa, eu ia para a sua. Fazíamos de tudo: comer, jogar, fazer dancinhas idiotas… qualquer coisa ao seu lado era perfeita.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <video className="timeline-video" src={video5} controls />
                                            </div>
                                        </div>

                                        <div className="timeline-row reverse-layout">
                                            <div className="timeline-text-col">
                                                <p>E então, sem perceber, eu meio que me mudei para sua casa. Sua mãe — que sempre foi incrível — nos recebeu, nos deu espaço, nos deu lar.</p>
                                                <p>Nessa época compramos nossa primeira filha: <strong>Bulma</strong>, nossa porquinha-da-índia.</p>
                                                <p>A vida estava calma… até o diagnóstico da sua irmã aparecer. Ela adoeceu. Ficou carequinha. Eu nunca vou saber o peso que você carregou. Mas sempre admirei a força, o amor entre vocês duas, e o quanto você foi gigante diante de tudo isso.</p>
                                                <p>No calor, mudamos para a casa da frente, e sua irmã passou a morar junto. De repente, estávamos vivendo todos sob um único teto. E mesmo com a falta de privacidade, eu queria que você tivesse o máximo de tempo possível com ela.</p>
                                                <p>O ano terminou com minha formatura, fotos lindas, mais um ciclo ao seu lado.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto6} className="timeline-photo" alt="Foto 6" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="timeline-divider" />

                            {/* 2023 */}
                            <div className="timeline-year-section" data-year="2023" ref={el => setSectionRef(el, '2023')}>
                                <h4
                                    onClick={() => toggleSection('2023')}
                                    className={`clickable-header ${unlockedSections['2023'] ? 'unlocked' : 'locked'}`}
                                >
                                    {unlockedSections['2023'] ? (expandedSections['2023'] ? '📂' : '📁') : '🔒'}
                                    {unlockedSections['2023'] ? ' 🌆 2023 — Dor, luta e renascimento' : ' ???'}
                                </h4>
                                {expandedSections['2023'] && unlockedSections['2023'] && (
                                    <div className="timeline-section-content">
                                        <div className="timeline-row">
                                            <div className="timeline-text-col">
                                                <p>Passamos a virada em Florianópolis. Novas ruas, passeios, barracas, shoppings, aquele dia em que a Iara, o Higor e os nenhos nos levaram para uma praia escondida e voltamos de barco… Coisas que eu sempre sonhei em viver, e você tornou realidade.</p>
                                                <p>Mas então veio o dia <strong>07/04</strong>. Sua irmã faleceu.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto7} className="timeline-photo" alt="Foto 7" />
                                            </div>
                                        </div>

                                        <div className="timeline-row reverse-layout">
                                            <div className="timeline-text-col">
                                                <p>Foi um choque para todos — e principalmente para você. Tudo que eu podia fazer era ficar ao seu lado. Mas a força verdadeira… essa foi sua. Você enfrentou a dor que ninguém merece carregar.</p>
                                                <p>Com o tempo, devagarzinho, comecei a ver seu sorriso voltar. E meu coração descansava toda vez que o via.</p>
                                                <p>Até que, no dia 21 de julho, nasceu nosso príncipe: <strong>Beijami</strong>. O anjo certo na hora certa. Hoje não consigo imaginá-lo com outro nome. Ele preencheu um vazio que ninguém sabia como curar.</p>
                                                <p>No fim do ano, compramos nosso apartamento e “casamos”. Eu com 19, você com 18. Tão jovens… e já conquistando o mundo juntos.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto8} className="timeline-photo" alt="Foto 8" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="timeline-divider" />

                            {/* 2024 */}
                            <div className="timeline-year-section" data-year="2024" ref={el => setSectionRef(el, '2024')}>
                                <h4
                                    onClick={() => toggleSection('2024')}
                                    className={`clickable-header ${unlockedSections['2024'] ? 'unlocked' : 'locked'}`}
                                >
                                    {unlockedSections['2024'] ? (expandedSections['2024'] ? '📂' : '📁') : '🔒'}
                                    {unlockedSections['2024'] ? ' 💫 2024 — Crescendo, conquistando, vivendo' : ' ???'}
                                </h4>
                                {expandedSections['2024'] && unlockedSections['2024'] && (
                                    <div className="timeline-section-content">
                                        <div className="timeline-row">
                                            <div className="timeline-text-col">
                                                <p>Outra virada em Floripa — agora com minha irmã junto. Brincamos, amamos de patinete (mesmo você quase quebrando o pé kkkk), e eu encerrei o ano vomitando no banheiro com claustrofobia… e perdendo os fogos. Você, claro, ficou preocupada — mas até hoje morre de rir da minha cara.</p>
                                                <p>Veio sua formatura. Você estava linda, radiante. Eu me enchia de orgulho da mulher incrível que estava se tornando.</p>
                                                <p>Seu irmão começou a nos ensinar a dirigir. Em 2024 compramos nosso primeiro carro — o lendário <strong>Gol G2</strong> — mesmo sem carteira. Eu dirigia tremendo, você acreditava em mim mesmo com medo também.</p>
                                                <p>Descobrimos o sítio do Klebin — aquele castelo onde prometi que vamos nos casar um dia. E tivemos nossa comemoração de 3 anos: alugamos um chalézinho, vivemos outra aventura perfeita.</p>
                                                <p>3 anos de muitos que ainda virão.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto9} className="timeline-photo" alt="Foto 9" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <hr className="timeline-divider" />

                            {/* 2025 */}
                            <div className="timeline-year-section" data-year="2025" ref={el => setSectionRef(el, '2025')}>
                                <h4
                                    onClick={() => toggleSection('2025')}
                                    className={`clickable-header ${unlockedSections['2025'] ? 'unlocked' : 'locked'}`}
                                >
                                    {unlockedSections['2025'] ? (expandedSections['2025'] ? '📂' : '📁') : '🔒'}
                                    {unlockedSections['2025'] ? ' 🏡 2025 — O ano das mudanças' : ' ???'}
                                </h4>
                                {expandedSections['2025'] && unlockedSections['2025'] && (
                                    <div className="timeline-section-content">
                                        <div className="timeline-row reverse-layout">
                                            <div className="timeline-text-col">
                                                <p>2025 chegou e talvez tenha sido o ano mais transformador da nossa vida. Trocamos de carro, alugamos um apartamento só nosso, amadurecemos como nunca.</p>
                                                <p>Mesmo endividados (kkkk), esse foi o ano em que mais nos aproximamos — o que parece loucura, porque sempre fomos colados. Mas amadurecer ao mesmo tempo que amar… isso é raro. E nós conseguimos.</p>
                                                <p>Descobrimos novos hobbies juntos: sair para jogar jogos de tabuleiro, cartas, ir a festas (coisa que eu comecei a gostar graças a você). E até fizemos nossa própria festa!</p>
                                                <p>Agora é <strong>19/12/2025</strong>. Quatro anos completos. E nossa linha do tempo pausa aqui — apenas pausa, nunca termina.</p>
                                            </div>
                                            <div className="timeline-media-col">
                                                <img src={foto10} className="timeline-photo" alt="Foto 10" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        <button className="module-button" onClick={() => setActiveModule('home')}>
                            ⬅️ Voltar ao Menu
                        </button>
                    </div>
                );
            case 'goals': return <FinancialGoals onBack={() => setActiveModule('home')} />;
            case 'travel': return <TravelIdeas onBack={() => setActiveModule('home')} />;
            case 'reminders': return <div className="module-container"><button className="module-button" onClick={() => setActiveModule('home')}>Voltar</button></div>;
            case 'quiz': return <RelationshipQuiz onBack={() => setActiveModule('home')} />;
            case 'places': return <VisitedPlaces onBack={() => setActiveModule('home')} />;
            default:
                return (
                    <>
                        <h1 className="main-title">Nosso Mar de Tesouros!</h1>
                        <p className="main-subtitle">Um oceano de memórias só para nós, meu amor.</p>
                        <div className="windows-grid">
                            <div className="app-window" onClick={() => setActiveModule('timeline')}>📖 Nossa História</div>
                            <div className="app-window" onClick={() => setActiveModule('goals')}>� Metas & Conquistas</div>
                            <div className="app-window" onClick={() => setActiveModule('travel')}>🗺️ Ideias de Viagens</div>
                            <div className="app-window" onClick={() => setActiveModule('reminders')}>🔔 Lembretes</div>
                            <div className="app-window" onClick={() => setActiveModule('quiz')}>❤️ Nosso Quiz</div>
                            <div className="app-window" onClick={() => setActiveModule('places')}>⭐ Lugares que Fomos</div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className={`main-app-container ${activeModule !== 'home' ? 'module-active' : ''}`}>
            <div className="floating-elements">
                <span>🐠</span><span>❤️</span><span>🐡</span><span>💖</span><span>🐟</span>
                <span>❤️</span><span>🐠</span><span>🐡</span><span>💖</span><span>🐟</span>
            </div>
            {renderModule()}
        </div>
    );
}

export default MainAppContent;

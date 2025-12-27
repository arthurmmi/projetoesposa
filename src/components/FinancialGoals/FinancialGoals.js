import React, { useState, useEffect } from 'react';
import api from '../../apiService'; // IMPORTAÇÃO DA API
import './FinancialGoals.css';

function FinancialGoals({ onBack }) {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    // Form State
    const [newGoal, setNewGoal] = useState({
        name: '',
        deadline: '',
        targetAmount: '',
        savedAmount: '',
        imageFile: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGoal(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewGoal(prev => ({ ...prev, imageFile: e.target.files[0] }));
        }
    };

    // Helper to compress image and return Base64
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // Aggressive compression to ensure it fits in Firestore (limit 1MB)
                    const MAX_WIDTH = 600;
                    const MAX_HEIGHT = 600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Export as Base64 string directly
                    const base64String = canvas.toDataURL('image/jpeg', 0.6); // 60% quality
                    resolve(base64String);
                };
                img.onerror = (err) => reject(new Error("Erro ao processar imagem"));
            };
            reader.onerror = (err) => reject(new Error("Erro ao ler arquivo"));
        });
    };

    const handleSaveGoal = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatusMessage('Processando...');

        try {
            let imageBase64 = null;

            // 1. Process New Image locally if selected
            if (newGoal.imageFile) {
                setStatusMessage('Processando nova foto...');
                imageBase64 = await compressImage(newGoal.imageFile);
            }

            const goalData = {
                name: newGoal.name,
                deadline: newGoal.deadline,
                targetAmount: parseFloat(newGoal.targetAmount) || 0,
                savedAmount: parseFloat(newGoal.savedAmount) || 0,
                // Only update imageUrl if a new one was generated
                ...(imageBase64 && { imageUrl: imageBase64 })
            };

            if (editingId) {
                // EDIT MODE
                setStatusMessage('Atualizando meta...');
                await api.updateFinancialGoal(editingId, goalData);
                setStatusMessage('Meta atualizada!');
            } else {
                // CREATE MODE
                setStatusMessage('Salvando nova meta...');
                await api.addFinancialGoal({
                    ...goalData,
                    imageUrl: imageBase64 || ''
                });
                setStatusMessage('Meta criada!');
            }

            // Cleanup
            setShowForm(false);
            setNewGoal({ name: '', deadline: '', targetAmount: '', savedAmount: '', imageFile: null });
            setEditingId(null);
            await fetchGoals();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setSubmitting(false);
            setStatusMessage('');
        }
    };

    // Prepare form for editing
    const handleEditGoal = (goal) => {
        setNewGoal({
            name: goal.name,
            deadline: goal.deadline,
            targetAmount: goal.targetAmount,
            savedAmount: goal.savedAmount,
            imageFile: null // Keep existing image unless changed
        });
        setEditingId(goal.id);
        setShowForm(true);
    };

    // Fetch Goals from API
    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const goalsData = await api.getFinancialGoals();
            setGoals(goalsData);
        } catch (error) {
            console.error("Erro ao buscar metas:", error);
            alert("Erro ao carregar as metas. Servidor conectou?");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGoal = async (goal) => {
        if (!window.confirm(`Tem certeza que deseja excluir a meta "${goal.name}"?`)) return;

        try {
            await api.deleteFinancialGoal(goal.id);
            setGoals(prev => prev.filter(g => g.id !== goal.id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir.");
        }
    };

    const calculateProgress = (saved, target) => {
        if (!target || target <= 0) return 0;
        const progress = (saved / target) * 100;
        return Math.min(progress, 100);
    };

    return (
        <div className="travel-container">
            <div className="travel-header">
                <button className="btn-secondary" onClick={onBack}>
                    ⬅️ Voltar
                </button>
                <div className="travel-title">🏆 Metas & Conquistas</div>
                <button className="btn-primary" onClick={() => {
                    setEditingId(null);
                    setNewGoal({ name: '', deadline: '', targetAmount: '', savedAmount: '', imageFile: null });
                    setShowForm(true);
                }}>
                    ➕ Nova Meta
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Carregando seus sonhos...</div>
            ) : (
                <div className="trips-grid">
                    {goals.length === 0 ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '1.2rem', color: 'white' }}>
                            Nenhuma meta definida ainda. Vamos conquistar o mundo? 🚀
                        </p>
                    ) : (
                        goals.map(goal => {
                            const isCompleted = goal.targetAmount > 0 && goal.savedAmount >= goal.targetAmount;
                            const progress = calculateProgress(goal.savedAmount, goal.targetAmount);

                            return (
                                <div key={goal.id} className="trip-card" style={isCompleted ? { border: '2px solid #00c853', boxShadow: '0 0 15px rgba(0,200,83,0.3)' } : {}}>
                                    <div className="trip-image-container">
                                        {goal.imageUrl ? (
                                            <img src={goal.imageUrl} alt={goal.name} className="trip-image" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                🎯 Sem foto
                                            </div>
                                        )}
                                        {isCompleted && (
                                            <div style={{
                                                position: 'absolute', top: 10, right: 10,
                                                background: '#00c853', color: 'white',
                                                padding: '5px 10px', borderRadius: '20px',
                                                fontWeight: 'bold', fontSize: '0.9rem',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                            }}>
                                                Conquistado! 🏆
                                            </div>
                                        )}
                                    </div>
                                    <div className="trip-details">
                                        <h3 className="trip-name">{goal.name}</h3>
                                        <div className="trip-date">📅 Prazo: {goal.deadline || 'Sem prazo'}</div>

                                        <div className="trip-finance">
                                            <div className="finance-row">
                                                <span>Meta: R$ {goal.targetAmount}</span>
                                                <span>Guardado: <span className="finance-value" style={isCompleted ? { color: '#00c853' } : {}}>R$ {goal.savedAmount}</span></span>
                                            </div>

                                            {isCompleted && <div style={{ textAlign: 'center', color: '#00c853', fontWeight: 'bold', margin: '5px 0', fontSize: '0.9rem' }}>Parabéns! Meta alcançada! 🍾</div>}

                                            <div className="progress-container">
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${progress}%`,
                                                        background: isCompleted ? 'linear-gradient(90deg, #00c853, #64dd17)' : 'linear-gradient(90deg, #FF6B6B, #FF8E53)'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="trip-actions">
                                            <button className="btn-icon" onClick={() => handleEditGoal(goal)} title="Editar Meta">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDeleteGoal(goal)} title="Excluir">🗑️</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>{editingId ? '✏️ Editar Meta' : '🚀 Nova Meta'}</h2>
                        <form onSubmit={handleSaveGoal}>
                            <div className="form-group">
                                <label>Nome da Meta</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={newGoal.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ex: Comprar Carro, Reforma..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Foto da Meta {editingId && '(Opcional)'}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Prazo Final</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    className="form-input"
                                    value={newGoal.deadline}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor da Meta (R$)</label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    className="form-input"
                                    value={newGoal.targetAmount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor Guardado (R$)</label>
                                <input
                                    type="number"
                                    name="savedAmount"
                                    className="form-input"
                                    value={newGoal.savedAmount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" style={{ color: '#333', borderColor: '#ccc' }} onClick={() => setShowForm(false)}>
                                    Cancelar
                                </button>
                                {submitting && <div style={{ marginTop: '10px', textAlign: 'center', color: '#0277bd' }}>{statusMessage}</div>}
                                <button type="submit" className="btn-primary" disabled={submitting}>
                                    {submitting ? 'Aguarde...' : editingId ? 'Salvar Alterações' : 'Criar Meta'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FinancialGoals;

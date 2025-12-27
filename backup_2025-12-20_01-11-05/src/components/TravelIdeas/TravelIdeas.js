import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './TravelIdeas.css';

function TravelIdeas({ onBack }) {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [newTrip, setNewTrip] = useState({
        name: '',
        date: '',
        cost: '',
        saved: '',
        imageFile: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTrip(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewTrip(prev => ({ ...prev, imageFile: e.target.files[0] }));
        }
    };

    const [statusMessage, setStatusMessage] = useState('');

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

    const handleSaveTrip = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatusMessage('Processando...');

        try {
            let imageBase64 = null;

            // 1. Process New Image locally if selected
            if (newTrip.imageFile) {
                setStatusMessage('Processando nova foto...');
                imageBase64 = await compressImage(newTrip.imageFile);
            }

            const tripData = {
                name: newTrip.name,
                date: newTrip.date,
                cost: parseFloat(newTrip.cost) || 0,
                saved: parseFloat(newTrip.saved) || 0,
                // Only update imageUrl if a new one was generated
                ...(imageBase64 && { imageUrl: imageBase64 })
            };

            if (editingId) {
                // EDIT MODE
                setStatusMessage('Atualizando viagem...');
                const tripRef = doc(db, "travel_ideas", editingId);
                await updateDoc(tripRef, tripData);
                setStatusMessage('Viagem atualizada!');
            } else {
                // CREATE MODE
                setStatusMessage('Salvando nova viagem...');
                await addDoc(collection(db, "travel_ideas"), {
                    ...tripData,
                    imageUrl: imageBase64 || '', // ensure value exists for new
                    createdAt: new Date()
                });
                setStatusMessage('Viagem criada!');
            }

            // Cleanup
            setShowForm(false);
            setNewTrip({ name: '', date: '', cost: '', saved: '', imageFile: null });
            setEditingId(null);
            await fetchTrips();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(`Erro ao salvar: ${error.message}`);
        } finally {
            setSubmitting(false);
            setStatusMessage('');
        }
    };

    // Prepare form for editing
    const handleEditTrip = (trip) => {
        setNewTrip({
            name: trip.name,
            date: trip.date,
            cost: trip.cost,
            saved: trip.saved,
            imageFile: null // Keep existing image unless changed
        });
        setEditingId(trip.id);
        setShowForm(true);
    };

    // Fetch Trips from Firestore
    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "travel_ideas"));
            const tripsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setTrips(tripsData);
        } catch (error) {
            console.error("Erro ao buscar viagens:", error);
            alert("Erro ao carregar as viagens.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTrip = async (trip) => {
        if (!window.confirm(`Tem certeza que deseja excluir a viagem para ${trip.name}?`)) return;

        try {
            await deleteDoc(doc(db, "travel_ideas", trip.id));
            setTrips(prev => prev.filter(t => t.id !== trip.id));
        } catch (error) {
            console.error("Erro ao excluir:", error);
            alert("Erro ao excluir.");
        }
    };

    const calculateProgress = (saved, cost) => {
        if (!cost || cost <= 0) return 0;
        const progress = (saved / cost) * 100;
        return Math.min(progress, 100);
    };

    return (
        <div className="travel-container">
            <div className="travel-header">
                <button className="btn-secondary" onClick={onBack}>
                    ⬅️ Voltar
                </button>
                <div className="travel-title">🗺️ Ideias de Viagem</div>
                <button className="btn-primary" onClick={() => {
                    setEditingId(null);
                    setNewTrip({ name: '', date: '', cost: '', saved: '', imageFile: null });
                    setShowForm(true);
                }}>
                    ➕ Novo Destino
                </button>
            </div>

            {loading ? (
                <div className="loading-spinner">Carregando seus sonhos...</div>
            ) : (
                <div className="trips-grid">
                    {trips.length === 0 ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', fontSize: '1.2rem' }}>
                            Nenhuma viagem planejada ainda. Que tal adicionar a primeira? ✈️
                        </p>
                    ) : (
                        trips.map(trip => {
                            const isCompleted = trip.cost > 0 && trip.saved >= trip.cost;
                            const progress = calculateProgress(trip.saved, trip.cost);

                            return (
                                <div key={trip.id} className="trip-card" style={isCompleted ? { border: '2px solid #00c853', boxShadow: '0 0 15px rgba(0,200,83,0.3)' } : {}}>
                                    <div className="trip-image-container">
                                        {trip.imageUrl ? (
                                            <img src={trip.imageUrl} alt={trip.name} className="trip-image" />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                🏖️ Sem foto
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
                                                Meta Atingida! 🎉
                                            </div>
                                        )}
                                    </div>
                                    <div className="trip-details">
                                        <h3 className="trip-name">{trip.name}</h3>
                                        <div className="trip-date">📅 {trip.date || 'Sem data definida'}</div>

                                        <div className="trip-finance">
                                            <div className="finance-row">
                                                <span>Meta: R$ {trip.cost}</span>
                                                {/* Edit triggers full modal now, but clicking here can also trigger it for convenience if we want. Keeping simple. */}
                                                <span>Guardado: <span className="finance-value" style={isCompleted ? { color: '#00c853' } : {}}>R$ {trip.saved}</span></span>
                                            </div>

                                            {isCompleted && <div style={{ textAlign: 'center', color: '#00c853', fontWeight: 'bold', margin: '5px 0', fontSize: '0.9rem' }}>Parabéns! Malas prontas? ✈️</div>}

                                            <div className="progress-container">
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${progress}%`,
                                                        background: isCompleted ? 'linear-gradient(90deg, #00c853, #64dd17)' : 'linear-gradient(90deg, #4fc3f7, #0288d1)'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="trip-actions">
                                            <button className="btn-icon" onClick={() => handleEditTrip(trip)} title="Editar Informações">✏️</button>
                                            <button className="btn-icon" onClick={() => handleDeleteTrip(trip)} title="Excluir">🗑️</button>
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
                        <h2>{editingId ? '✏️ Editar Viagem' : '✈️ Planejar Nova Viagem'}</h2>
                        <form onSubmit={handleSaveTrip}>
                            <div className="form-group">
                                <label>Lugar para ir (Nome)</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    value={newTrip.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Ex: Paris, Praia do Forte..."
                                />
                            </div>

                            <div className="form-group">
                                <label>Foto do Lugar {editingId && '(Opcional se já tiver)'}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label>Data Prevista</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-input"
                                    value={newTrip.date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor Estimado (R$)</label>
                                <input
                                    type="number"
                                    name="cost"
                                    className="form-input"
                                    value={newTrip.cost}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="form-group">
                                <label>Quanto já guardamos? (R$)</label>
                                <input
                                    type="number"
                                    name="saved"
                                    className="form-input"
                                    value={newTrip.saved}
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
                                    {submitting ? 'Aguarde...' : editingId ? 'Salvar Alterações' : 'Salvar Viagem'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TravelIdeas;

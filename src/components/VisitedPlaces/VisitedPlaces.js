import React, { useState, useEffect } from "react";
import "./VisitedPlaces.css";

import api from "../../apiService";

// 🚨 A MÁGICA ESTÁ AQUI: Recebemos "onBack" como propriedade
function VisitedPlaces({ onBack }) {
    const [places, setPlaces] = useState([]);
    const [activeTab, setActiveTab] = useState("Restaurante");

    // Estados do Formulário
    const [name, setName] = useState("");
    const [category, setCategory] = useState("Restaurante");
    const [rating, setRating] = useState(0);
    const [notes, setNotes] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // ------------------------------
    // 🔥 BUSCAR DO BACKEND (API)
    // ------------------------------
    useEffect(() => {
        async function loadPlaces() {
            try {
                const loaded = await api.getPlaces();
                setPlaces(loaded);
            } catch (error) {
                console.error("Erro ao carregar lugares:", error);
            }
        }
        loadPlaces();
    }, []);

    // Atualiza o select quando muda a aba (apenas se não estiver editando)
    useEffect(() => {
        if (!editingId) {
            setCategory(activeTab);
        }
    }, [activeTab, editingId]);

    // ------------------------------
    // ⭐ FUNÇÕES DO SISTEMA
    // ------------------------------
    function handleStarClick(value) {
        setRating(value);
    }

    function startEditing(place) {
        setEditingId(place.id);
        setName(place.name);
        setCategory(place.category);
        setRating(place.rating);
        setNotes(place.notes);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEditing() {
        setEditingId(null);
        setName("");
        setRating(0);
        setNotes("");
        setCategory(activeTab);
    }

    // ------------------------------
    // 💾 SALVAR (Adicionar ou Editar)
    // ------------------------------
    async function handleSave() {
        if (!name.trim()) return;

        try {
            if (editingId) {
                const updatedPlace = await api.updatePlace(editingId, { name, category, rating, notes });
                setPlaces(places.map(p => p.id === editingId ? updatedPlace : p));
                setEditingId(null);
            } else {
                const newPlace = await api.addPlace({ name, category, rating, notes });
                setPlaces([...places, newPlace]);
            }
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar. Verifique se o servidor está rodando.");
        }

        setName("");
        setRating(0);
        setNotes("");
    }

    // ------------------------------
    // ❌ EXCLUSÃO
    // ------------------------------
    function openDeleteModal(id) {
        setDeleteId(id);
    }

    async function confirmDelete() {
        try {
            await api.deletePlace(deleteId);
            setPlaces(places.filter((p) => p.id !== deleteId));
            setDeleteId(null);
            if (editingId === deleteId) cancelEditing();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            alert("Erro ao deletar.");
        }
    }

    // ------------------------------
    // 🔙 LÓGICA DO BOTÃO VOLTAR (CORRIGIDA)
    // ------------------------------
    function handleBack() {
        // Verifica se o MainAppContent mandou a função de voltar
        if (onBack) {
            onBack(); // Executa a função que volta pro menu 'home'
        } else {
            // Fallback de segurança: se algo der errado, recarrega a página
            window.location.reload();
        }
    }

    const filteredPlaces = places.filter(p => p.category === activeTab);

    return (
        <div className="places-container">

            {/* 🚨 BOTÃO DE VOLTAR AO MENU */}
            <div className="header-actions">
                <button className="back-menu-btn" onClick={handleBack}>
                    ⬅ Menu
                </button>
            </div>

            <h1 className="places-title">⭐ Nossas Memórias ⭐</h1>

            <div className="category-tabs">
                <button className={`tab-btn ${activeTab === 'Restaurante' ? 'active' : ''}`} onClick={() => setActiveTab('Restaurante')}>Restaurantes</button>
                <button className={`tab-btn ${activeTab === 'Viagem' ? 'active' : ''}`} onClick={() => setActiveTab('Viagem')}>Cidades/Viagens</button>
                <button className={`tab-btn ${activeTab === 'Filme' ? 'active' : ''}`} onClick={() => setActiveTab('Filme')}>Filmes/Séries</button>
            </div>

            {/* Formulário (Muda de cor se estiver editando) */}
            <div className={`add-place-form ${editingId ? 'editing-mode' : ''}`}>
                <h3>{editingId ? `Editando: ${name}` : "Adicionar nova memória"}</h3>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Restaurante">Restaurante</option>
                    <option value="Viagem">Cidade / Viagem</option>
                    <option value="Filme">Filme / Série</option>
                </select>

                <input type="text" placeholder="Nome (ex: Parque Ibirapuera)" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span key={i} className={`star ${rating >= i ? "filled" : ""}`} onClick={() => handleStarClick(i)}>★</span>
                    ))}
                </div>

                <textarea placeholder="Uma nota especial sobre esse dia..." value={notes} onChange={(e) => setNotes(e.target.value)}></textarea>

                <div className="form-buttons">
                    {editingId && <button className="cancel-button" onClick={cancelEditing}>Cancelar</button>}
                    <button className="add-button" onClick={handleSave}>{editingId ? "Salvar Alterações" : "Adicionar à Lista"}</button>
                </div>
            </div>

            {/* Lista de Itens */}
            <div className="places-list">
                {filteredPlaces.length === 0 ? (
                    <p className="empty-list-message">Nenhuma memória nesta categoria ainda...</p>
                ) : (
                    filteredPlaces.map((p) => (
                        <div key={p.id} className="place-item">
                            <div className="card-actions">
                                <button className="edit-button" onClick={() => startEditing(p)} title="Editar">✎</button>
                                <button className="delete-button" onClick={() => openDeleteModal(p.id)} title="Excluir">X</button>
                            </div>
                            <h3>{p.name}</h3>
                            <div className="star-rating">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <span key={i} className={`star ${p.rating >= i ? "filled" : ""}`}>★</span>
                                ))}
                            </div>
                            <p className="place-notes">{p.notes}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Exclusão */}
            {deleteId && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal-box">
                        <h3>Deseja excluir?</h3>
                        <p>Isso não poderá ser desfeito.</p>
                        <div className="modal-buttons">
                            <button className="modal-btn cancel" onClick={() => setDeleteId(null)}>Cancelar</button>
                            <button className="modal-btn confirm" onClick={confirmDelete}>Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VisitedPlaces;
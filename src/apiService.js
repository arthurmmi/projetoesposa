// src/apiService.js
const API_URL = 'https://backend-projeto-esposa.onrender.com';

export const fetchViagens = async () => {
    try {
        const response = await fetch(`${API_URL}/viagens`);
        if (!response.ok) throw new Error('Erro ao buscar viagens');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchPlaces = async () => {
    try {
        const response = await fetch(`${API_URL}/places`);
        if (!response.ok) throw new Error('Erro ao buscar lugares');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchMetas = async () => {
    try {
        const response = await fetch(`${API_URL}/metas`);
        if (!response.ok) throw new Error('Erro ao buscar metas');
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

const API_URL = 'https://backend-projeto-esposa.onrender.com/api';


const api = {
    // --- PLACES ---
    getPlaces: async () => {
        const response = await fetch(`${API_URL}/places`);
        return response.json();
    },
    addPlace: async (place) => {
        const response = await fetch(`${API_URL}/places`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(place)
        });
        return response.json();
    },
    updatePlace: async (id, place) => {
        const response = await fetch(`${API_URL}/places/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(place)
        });
        return response.json();
    },
    deletePlace: async (id) => {
        await fetch(`${API_URL}/places/${id}`, { method: 'DELETE' });
    },

    // --- TRAVEL IDEAS ---
    getTravelIdeas: async () => {
        const response = await fetch(`${API_URL}/travel_ideas`);
        return response.json();
    },
    addTravelIdea: async (trip) => {
        const response = await fetch(`${API_URL}/travel_ideas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trip)
        });
        return response.json();
    },
    updateTravelIdea: async (id, trip) => {
        const response = await fetch(`${API_URL}/travel_ideas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trip)
        });
        return response.json();
    },
    deleteTravelIdea: async (id) => {
        await fetch(`${API_URL}/travel_ideas/${id}`, { method: 'DELETE' });
    },

    // --- FINANCIAL GOALS ---
    getFinancialGoals: async () => {
        const response = await fetch(`${API_URL}/financial_goals`);
        return response.json();
    },
    addFinancialGoal: async (goal) => {
        const response = await fetch(`${API_URL}/financial_goals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal)
        });
        return response.json();
    },
    updateFinancialGoal: async (id, goal) => {
        const response = await fetch(`${API_URL}/financial_goals/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(goal)
        });
        return response.json();
    },
    deleteFinancialGoal: async (id) => {
        await fetch(`${API_URL}/financial_goals/${id}`, { method: 'DELETE' });
    }
};

export default api;

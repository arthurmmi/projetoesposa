import React, { useEffect, useState } from 'react';
import { fetchViagens, fetchPlaces, fetchMetas } from './apiService';

const App = () => {
    const [viagens, setViagens] = useState([]);
    const [places, setPlaces] = useState([]);
    const [metas, setMetas] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            setViagens(await fetchViagens());
            setPlaces(await fetchPlaces());
            setMetas(await fetchMetas());
        };
        loadData();
    }, []);

    return (
        <div>
            <h1>Viagens</h1>
            <pre>{JSON.stringify(viagens, null, 2)}</pre>

            <h1>Lugares Visitados</h1>
            <pre>{JSON.stringify(places, null, 2)}</pre>

            <h1>Metas Financeiras</h1>
            <pre>{JSON.stringify(metas, null, 2)}</pre>
        </div>
    );
};

export default App;

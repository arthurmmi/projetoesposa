const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

const app = express();

// Aumentando limite do payload para suportar imagens em Base64
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// --- ROUTES: PLACES (Lugares Visitados) ---
app.get('/api/places', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM places ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/api/places', async (req, res) => {
    try {
        const { name, category, rating, notes } = req.body;
        const result = await db.query(
            'INSERT INTO places (name, category, rating, notes) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, category, rating, notes]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.put('/api/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, rating, notes } = req.body;
        const result = await db.query(
            'UPDATE places SET name = $1, category = $2, rating = $3, notes = $4 WHERE id = $5 RETURNING *',
            [name, category, rating, notes, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/api/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM places WHERE id = $1', [id]);
        res.json({ message: "Lugar deletado com sucesso!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// --- ROUTES: TRAVEL IDEAS ---
app.get('/api/travel_ideas', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM travel_ideas ORDER BY created_at DESC');
        // Mapeando para o formato que o front espera (camelCase)
        const formatted = result.rows.map(row => ({
            ...row,
            imageUrl: row.image_url // Postgres retorna snake_case por padrão
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/api/travel_ideas', async (req, res) => {
    try {
        const { name, date, cost, saved, imageUrl } = req.body;
        const result = await db.query(
            'INSERT INTO travel_ideas (name, date, cost, saved, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, date, cost, saved, imageUrl]
        );
        const row = result.rows[0];
        res.json({ ...row, imageUrl: row.image_url });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.put('/api/travel_ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, cost, saved, imageUrl } = req.body;

        // Se imageUrl não for enviado (pq não mudou), precisamos tratar isso?
        // O front manda o objeto completo, ou só parciais? O front atual manda tudo.
        // Se imageUrl vier undefined, manter o antigo é mais seguro, mas vamos assumir que o front manda ou usamos COALESCE no SQL.
        // Para simplificar, vou fazer uma query dinâmica simples ou assumir que o front manda tudo.

        // Estratégia: Se imageUrl for fornecido, atualiza. Se não, mantem.
        let query = 'UPDATE travel_ideas SET name=$1, date=$2, cost=$3, saved=$4 WHERE id=$6 RETURNING *';
        let params = [name, date, cost, saved, imageUrl, id];

        if (imageUrl) {
            query = 'UPDATE travel_ideas SET name=$1, date=$2, cost=$3, saved=$4, image_url=$5 WHERE id=$6 RETURNING *';
        } else {
            // Remove imageUrl dos parametros se não for atualizar
            params = [name, date, cost, saved, id];
            query = 'UPDATE travel_ideas SET name=$1, date=$2, cost=$3, saved=$4 WHERE id=$5 RETURNING *';
        }

        const result = await db.query(query, params);
        const row = result.rows[0];
        res.json({ ...row, imageUrl: row.image_url });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/api/travel_ideas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM travel_ideas WHERE id = $1', [id]);
        res.json({ message: "Viagem deletada" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

// --- ROUTES: FINANCIAL GOALS ---
app.get('/api/financial_goals', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM financial_goals ORDER BY created_at DESC');
        const formatted = result.rows.map(row => ({
            ...row,
            targetAmount: row.target_amount, // snake_case mapping
            savedAmount: row.saved_amount,
            imageUrl: row.image_url
        }));
        res.json(formatted);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.post('/api/financial_goals', async (req, res) => {
    try {
        const { name, deadline, targetAmount, savedAmount, imageUrl } = req.body;
        const result = await db.query(
            'INSERT INTO financial_goals (name, deadline, target_amount, saved_amount, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, deadline, targetAmount, savedAmount, imageUrl]
        );
        const row = result.rows[0];
        res.json({
            ...row,
            targetAmount: row.target_amount,
            savedAmount: row.saved_amount,
            imageUrl: row.image_url
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.put('/api/financial_goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, deadline, targetAmount, savedAmount, imageUrl } = req.body;

        let query, params;

        if (imageUrl) {
            query = 'UPDATE financial_goals SET name=$1, deadline=$2, target_amount=$3, saved_amount=$4, image_url=$5 WHERE id=$6 RETURNING *';
            params = [name, deadline, targetAmount, savedAmount, imageUrl, id];
        } else {
            query = 'UPDATE financial_goals SET name=$1, deadline=$2, target_amount=$3, saved_amount=$4 WHERE id=$5 RETURNING *';
            params = [name, deadline, targetAmount, savedAmount, id];
        }

        const result = await db.query(query, params);
        const row = result.rows[0];
        res.json({
            ...row,
            targetAmount: row.target_amount,
            savedAmount: row.saved_amount,
            imageUrl: row.image_url
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

app.delete('/api/financial_goals/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM financial_goals WHERE id = $1', [id]);
        res.json({ message: "Meta deletada" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

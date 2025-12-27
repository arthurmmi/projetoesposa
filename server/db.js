const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

pool.on('connect', () => {
    console.log('Pool conectado ao PostgreSQL!');
});

pool.on('error', (err) => {
    console.error('Erro inesperado no client do banco:', err);
    process.exit(-1);
});

const initDb = async () => {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS places (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT,
                rating INTEGER,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS travel_ideas (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                date TEXT,
                cost DECIMAL(10, 2),
                saved DECIMAL(10, 2),
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE TABLE IF NOT EXISTS financial_goals (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                deadline TEXT,
                target_amount DECIMAL(10, 2),
                saved_amount DECIMAL(10, 2),
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Tabelas verificadas/criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar tabelas:", error);
    } finally {
        client.release();
    }
};

// Executa a inicialização
initDb();

module.exports = {
    query: (text, params) => pool.query(text, params),
};

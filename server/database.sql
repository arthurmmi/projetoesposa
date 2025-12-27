CREATE DATABASE projeto_esposa_db;

-- Conecte-se ao banco 'projeto_esposa_db' antes de rodar os comandos abaixo --

-- Tabela de Lugares Visitados
CREATE TABLE IF NOT EXISTS places (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    rating INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Ideias de Viagem
CREATE TABLE IF NOT EXISTS travel_ideas (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    date TEXT,
    cost DECIMAL(10, 2),
    saved DECIMAL(10, 2),
    image_url TEXT, -- Armazenará Base64
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Metas Financeiras
CREATE TABLE IF NOT EXISTS financial_goals (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    deadline TEXT,
    target_amount DECIMAL(10, 2),
    saved_amount DECIMAL(10, 2),
    image_url TEXT, -- Armazenará Base64
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

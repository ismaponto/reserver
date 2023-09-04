require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function query(text, params) {
    try {
        const result = await pool.query(text, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = { query };
module.exports = pool;
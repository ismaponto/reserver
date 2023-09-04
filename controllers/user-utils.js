const db = require('../db/db'); // Importa el módulo de base de datos

async function getUserByEmail(email) {
    try {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await db.query(query, [email]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user by email:', error);
        return null;
    }
}
const bcrypt = require('bcrypt');

async function comparePassword(candidatePassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(candidatePassword, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
}



module.exports = { getUserByEmail, comparePassword };
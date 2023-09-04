const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');

// Ruta para registrar un nuevo usuario
router.post('/register', async(req, res) => {
    const { nombre, apellido, email, password } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM Usuarios WHERE email = $1', [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Este e-mail ya está en uso' });
        }

        if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO Usuarios (nombre, apellido, email, contraseña_hash, role_id, fecha_creacion) VALUES ($1, $2, $3, $4, $5, $6)', [nombre, apellido, email, hashedPassword, 3, new Date()]
        );

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});


// Ruta para cambiar la contraseña

router.put('/change-password', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await pool.query('SELECT * FROM Usuarios WHERE user_id = $1', [userId]);
        const currentPassword = user.rows[0].contraseña_hash;

        const passwordMatches = await bcrypt.compare(oldPassword, currentPassword);
        if (!passwordMatches) {
            return res.status(400).json({ message: 'La contraseña actual no es válida' });
        }

        if (newPassword.length < 8 || !/[a-z]/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres y contener al menos una letra mayúscula, una letra minúscula y un número.' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE Usuarios SET contraseña_hash = $1 WHERE user_id = $2', [hashedNewPassword, userId]);

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
});


// Ruta para actualizar el perfil del usuario
router.put('/profile', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;
    const { nombre, apellido, telefono } = req.body;

    try {
        await pool.query(
            'UPDATE Usuarios SET nombre = $1, apellido = $2, telefono = $3 WHERE user_id = $4', [nombre, apellido, telefono, userId]
        );
        return res.status(200).json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
});


// Ruta para eliminar la cuenta de usuario
router.delete('/delete-account', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;

    try {
        await pool.query('DELETE FROM Usuarios WHERE user_id = $1', [userId]);
        req.logout();
        return res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar la cuenta' });
    }
});
module.exports = router;
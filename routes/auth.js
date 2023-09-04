const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const ensureAuthenticated = require('../middleware/ensureAuthenticated');



// Ruta para que el administrador vea las solicitudes de cambio a profesor
router.get('/admin/requests', ensureAuthenticated, async(req, res) => {
    const adminUserId = req.user.user_id;

    try {
        const adminUser = await pool.query('SELECT * FROM Usuarios WHERE user_id = $1', [adminUserId]);
        if (adminUser.rows[0].role_id !== 1) {
            return res.status(403).json({ message: 'No tienes autorización para ver las solicitudes' });
        }

        const requests = await pool.query('SELECT * FROM Solicitudes');

        return res.status(200).json(requests.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las solicitudes' });
    }
});

// Ruta para que el administrador apruebe / rechace las solicitudes
router.put('/admin/approve-request/:requestId', ensureAuthenticated, async(req, res) => {
    const adminUserId = req.user.user_id;
    const requestId = req.params.requestId;
    const { action } = req.body;

    try {
        const adminUser = await pool.query('SELECT * FROM Usuarios WHERE user_id = $1', [adminUserId]);
        if (adminUser.rows[0].role_id !== 1) {
            return res.status(403).json({ message: 'No tienes autorización para aprobar solicitudes' });
        }

        const request = await pool.query('SELECT * FROM Solicitudes WHERE solicitud_id = $1', [requestId]);
        if (request.rows.length === 0) {
            return res.status(404).json({ message: 'Solicitud no encontrada' });
        }

        if (action === 'approve') {
            await pool.query('UPDATE Solicitudes SET status = $1 WHERE solicitud_id = $2', ['aprobada', requestId]);
            await pool.query('UPDATE Usuarios SET profesor_aprobado = TRUE WHERE user_id = $1', [request.rows[0].user_id]);
        } else if (action === 'reject') {
            await pool.query('UPDATE Solicitudes SET status = $1 WHERE solicitud_id = $2', ['rechazada', requestId]);
        }

        return res.status(200).json({ message: 'Solicitud actualizada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar la solicitud' });
    }
});







// Resto de las rutas existentes...

module.exports = router;
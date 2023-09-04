const { pool } = require('../db/db');
const { getUserByEmail } = require('./user-utils');
const { checkProfessorAvailability } = require('./availability-utils');

async function checkExistingReservation(req, res, next) {
    const { profesor_id, fecha_reserva } = req.body;

    try {
        const query = 'SELECT * FROM Reservas WHERE profesor_id = $1 AND fecha_reserva = $2';
        const values = [profesor_id, fecha_reserva];
        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            return res.status(400).json({ message: 'Ya existe una reserva en este horario' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar reserva existente' });
    }
}

async function checkProfessorAvailabilityMiddleware(req, res, next) {
    const { profesor_id, fecha_reserva } = req.body;

    try {
        const user = await getUserByEmail(req.user.email);
        const isProfessorAvailable = await checkProfessorAvailability(profesor_id, fecha_reserva, user.id);

        if (!isProfessorAvailable) {
            return res.status(400).json({ message: 'El profesor no está disponible en este horario' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error al verificar disponibilidad del profesor' });
    }
}

module.exports = { checkExistingReservation, checkProfessorAvailabilityMiddleware };
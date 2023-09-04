const { pool } = require('../db/db');

async function checkProfessorAvailability(profesor_id, fecha_reserva) {
    try {
        // Verificar si hay una reserva ya realizada en el mismo horario
        const reservationQuery = `
            SELECT id
            FROM Reservas
            WHERE profesor_id = $1
                AND fecha_reserva = $2
        `;
        const reservationValues = [profesor_id, fecha_reserva];
        const reservationResult = await pool.query(reservationQuery, reservationValues);

        if (reservationResult.rows.length > 0) {
            return false; // Ya hay una reserva en este horario
        }

        // Puedes agregar aquí otras condiciones para verificar la disponibilidad del profesor,
        // como horarios específicos en los que el profesor no esté disponible.

        return true; // El profesor está disponible en este horario
    } catch (error) {
        console.error('Error al verificar disponibilidad del profesor:', error);
        return false;
    }
}

module.exports = { checkProfessorAvailability };
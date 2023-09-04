const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/ensureAuthenticated');
const professorController = require('../controllers/professorController');
const { approveReservations, cancelReservations, getReservationsByDateRange } = require('../controllers/reservation-utils');


//el profesor ve las clases que le quedan pendientes
router.get('/pending-class-requests',
    ensureAuthenticated,
    professorController.getPendingClassRequests);

router.post('/approve', async(req, res) => {
    const { reservationIds } = req.body;

    if (!reservationIds || !Array.isArray(reservationIds) || reservationIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Se requiere un arreglo de reservationIds válido en el cuerpo de la solicitud.' });
    }

    try {
        const result = await approveReservations(reservationIds);

        if (result.success) {
            return res.status(200).json({ success: true, message: 'Reservas aprobadas con éxito' });
        } else {
            return res.status(500).json({ success: false, message: 'Error al aprobar reservas' });
        }
    } catch (error) {
        console.error('Error al aprobar reservas:', error);
        return res.status(500).json({ success: false, message: 'Error al aprobar reservas' });
    }
});


// Ruta para que el profesor cancele varias reservas
router.post('/cancel', async(req, res) => {
    const { reservationIds } = req.body;

    if (!reservationIds || !Array.isArray(reservationIds) || reservationIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Se requiere un arreglo de reservationIds válido en el cuerpo de la solicitud.' });
    }

    try {
        const result = await cancelReservations(reservationIds);

        if (result.success) {
            return res.status(200).json({ success: true, message: 'Reservas canceladas con éxito' });
        } else {
            return res.status(500).json({ success: false, message: 'Error al cancelar reservas' });
        }
    } catch (error) {
        console.error('Error al cancelar reservas:', error);
        return res.status(500).json({ success: false, message: 'Error al cancelar reservas' });
    }
});


// Ruta para que los profesores creen sus propias reservas
router.post('/indsponible', ensureAuthenticated, async(req, res) => {
    const { fecha_reserva } = req.body;
    const profesor_id = req.user.user_id; // Suponemos que puedes acceder al ID del profesor autenticado

    try {
        // Verificar si el profesor ya tiene una reserva en el mismo horario
        const existingReservationQuery = `
            SELECT id
            FROM Reservas
            WHERE profesor_id = $1
                AND fecha_reserva = $2
        `;
        const existingReservationValues = [profesor_id, fecha_reserva];
        const existingReservationResult = await pool.query(existingReservationQuery, existingReservationValues);

        if (existingReservationResult.rows.length > 0) {
            const arrayReserveToCancel = existingReservationResult.rows
            cancelReservations(arrayReserveToCancel);
        }

        // Crear la reserva en la base de datos
        const createReservationQuery = `
            INSERT INTO Reservas (profesor_id, fecha_reserva, estado, fecha_creacion)
            VALUES ($1, $2, $3, $4)
        `;
        const createReservationValues = [profesor_id, fecha_reserva, 'No disponible', new Date()];
        await pool.query(createReservationQuery, createReservationValues);

        return res.status(201).json({ message: 'Se ha marcado efectivamente su no disponibiliad' });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        return res.status(500).json({ message: 'Surgio un error al tratar de marcar su indisponibilidad' });
    }
});

// Ruta para que el profesor cancele horarios dentro de un rango de fechas
router.post('/cancel-by-date-range', async(req, res) => {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
        return res.status(400).json({ success: false, message: 'Se requieren las fechas de inicio y fin en el cuerpo de la solicitud.' });
    }

    try {
        const reservasACanselar = await getReservationsByDateRange(startDate, endDate);
        if (result) {
            cancelReservations(result)
        }
        if (result.success) {
            return res.status(200).json({ success: true, message: 'Horarios cancelados con éxito' });
        } else {
            return res.status(500).json({ success: false, message: 'Error al cancelar horarios' });
        }
    } catch (error) {
        console.error('Error al cancelar horarios:', error);
        return res.status(500).json({ success: false, message: 'Error al cancelar horarios' });
    }
});



module.exports = router;
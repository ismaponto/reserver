const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Asegúrate de tener configurada tu conexión a la base de datos
const ensureAuthenticated = require('../middleware/ensureAuthenticated'); // Middleware para verificar autenticación
const { checkExistingReservation, checkProfessorAvailabilityMiddleware } = require('../controllers/reservation-middleware');


//ruta para crear un pedido de reserva por usuario
router.post('/create', ensureAuthenticated, checkExistingReservation, checkProfessorAvailabilityMiddleware, async(req, res) => {
    const { profesor_id, fecha_reserva } = req.body;
    const user_id = req.user.user_id;

    try {
        // Crear la reserva en la base de datos
        const query = 'INSERT INTO Reservas (user_id, profesor_id, fecha_reserva, estado, fecha_creacion) VALUES ($1, $2, $3, $4, $5)';
        const values = [user_id, profesor_id, fecha_reserva, 'pendiente', new Date()];
        await pool.query(query, values);

        return res.status(201).json({ message: 'Reserva creada exitosamente, aguarde la respuesta del profesor' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al crear la reserva, intentelo de nuevo' });
    }
});


//ruta para que un profesor valide la reserva
router.put('/approve/:reservationId', ensureAuthenticated, async(req, res) => {
    const profesor_id = req.user.user_id; // Suponemos que puedes acceder al ID del usuario autenticado como profesor
    const { reservationId } = req.params;
    const { action } = req.body; // Debes enviar "approve" o "reject" en el cuerpo de la solicitud

    try {
        // Verificar si el profesor tiene autorización para aprobar esta reserva
        const query = 'SELECT * FROM Reservas WHERE reserva_id = $1';
        const result = await pool.query(query, [reservationId]);
        const reservation = result.rows[0];

        if (!reservation || reservation.profesor_id !== profesor_id) {
            return res.status(403).json({ message: 'No tienes autorización para aprobar esta reserva' });
        }

        // Actualizar el estado de la reserva según la acción
        const updateQuery = 'UPDATE Reservas SET estado = $1 WHERE reserva_id = $2';
        const newState = (action === 'approve') ? 'aprobada' : 'rechazada';
        await pool.query(updateQuery, [newState, reservationId]);
        const { nameClient, emailClient } = await pool.query('Select nombre, email FROM usuarios where userId =$1', [reservation.userId])
        await sendConfirmationEmail(emailClient, nameClient, req.profesor_id, fecha_reserva)

        return res.status(200).json({ message: 'Estado de la reserva actualizado' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el estado de la reserva' });
    }
});

router.put('/correct/:reservationId', ensureAuthenticated, async(req, res) => {
    const profesor_id = req.user.user_id; // Suponemos que puedes acceder al ID del usuario autenticado como profesor
    const { reservationId } = req.params;

    try {
        // Verificar si el profesor tiene autorización para corregir esta reserva
        const query = 'SELECT * FROM Reservas WHERE reserva_id = $1';
        const result = await pool.query(query, [reservationId]);
        const reservation = result.rows[0];

        if (!reservation || reservation.profesor_id !== profesor_id) {
            return res.status(403).json({ message: 'No tienes autorización para corregir esta reserva' });
        }

        // Verificar si la reserva está desaprobada y si ha pasado menos de 30 minutos desde que se aprobó
        if (reservation.estado === 'desaprobada') {
            const tiempoDesdeAprobacion = new Date() - reservation.fecha_aprobacion;
            const tiempoLimiteEnMilisegundos = 30 * 60 * 1000; // 30 minutos en milisegundos

            if (tiempoDesdeAprobacion <= tiempoLimiteEnMilisegundos) {
                // Realizar la corrección de la reserva aquí
                // Por ejemplo, cambiar el estado de 'desaprobada' a 'pendiente' u otro estado deseado

                const updateQuery = 'UPDATE Reservas SET estado = $1 WHERE reserva_id = $2';
                await pool.query(updateQuery, ['pendiente', reservationId]);

                return res.status(200).json({ message: 'Reserva corregida exitosamente' });
            }
        }

        return res.status(400).json({ message: 'No es posible corregir esta reserva en este momento' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al corregir la reserva' });
    }
});

// Ruta para ver todas las reservas de un cliente
router.get('/client', ensureAuthenticated, async(req, res) => {
    const user_id = req.user.user_id; // Suponemos que puedes acceder al ID del usuario autenticado

    try {
        const query = 'SELECT * FROM Reservas WHERE user_id = $1';
        const result = await pool.query(query, [user_id]);
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las reservas' });
    }
});

// Ruta para ver todas las reservas de un profesor
router.get('/professor', ensureAuthenticated, async(req, res) => {
    const profesor_id = req.user.user_id; // Suponemos que puedes acceder al ID del usuario autenticado como profesor

    try {
        const query = 'SELECT * FROM Reservas WHERE profesor_id = $1';
        const result = await pool.query(query, [profesor_id]);
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las reservas' });
    }
});


router.get('/past-reservations', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;

    try {
        const pastReservations = await getPastReservations(userId);
        return res.status(200).json(pastReservations);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las reservas pasadas' });
    }
});

router.get('/future-reservations', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;

    try {
        const futureReservations = await getFutureReservations(userId);
        return res.status(200).json(futureReservations);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las reservas futuras' });
    }
});

router.get('/weekly-reservations', ensureAuthenticated, async(req, res) => {
    const userId = req.user.user_id;
    const { start_date, end_date } = req.query;

    try {
        const weeklyReservations = await getWeeklyReservations(userId, start_date, end_date);
        return res.status(200).json(weeklyReservations);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las reservas semanales' });
    }
});
// ... Otras rutas de reservas ...

module.exports = router;
const pool = require('../db/db');

exports.getPendingClassRequests = async(req, res) => {
    const professorId = req.user.user_id;

    try {
        // Obtener las solicitudes pendientes de clases para el profesor
        const pendingClassRequests = await pool.query('SELECT * FROM Reservas WHERE profesor_id = $1 AND estado = $2', [professorId, 'pendiente']);
        return res.status(200).json(pendingClassRequests.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las solicitudes pendientes de clases' });
    }
};

exports.approveClassRequest = async(req, res) => {
    const requestId = req.params.requestId;

    try {
        // Cambiar el estado de la solicitud de clase a "confirmada"
        await pool.query('UPDATE Reservas SET estado = $1 WHERE reserva_id = $2', ['confirmada', requestId]);
        return res.status(200).json({ message: 'Solicitud de clase confirmada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al confirmar la solicitud de clase' });
    }
};
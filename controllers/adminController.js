const pool = require('../db/db');

exports.getPendingRequests = async(req, res) => {
    try {
        // Obtener las solicitudes pendientes de profesores
        const pendingRequests = await pool.query('SELECT * FROM SolicitudProfesor WHERE status = $1', ['pendiente']);
        return res.status(200).json(pendingRequests.rows);
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener las solicitudes pendientes' });
    }
};

exports.approveProfessorRequest = async(req, res) => {
    const requestId = req.params.requestId;

    try {
        // Cambiar el estado de la solicitud a "aprobada"
        await pool.query('UPDATE SolicitudProfesor SET status = $1 WHERE solicitud_id = $2', ['aprobada', requestId]);
        return res.status(200).json({ message: 'Solicitud de profesor aprobada exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: 'Error al aprobar la solicitud de profesor' });
    }
};

// Otros métodos y acciones de administrador...
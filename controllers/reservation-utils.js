const { pool } = require('../db/db'); // Asegúrate de importar tu conexión a la base de datos
const { sendApprovalEmail, sendCancellationEmail } = require('./email-utils'); // Importa las funciones de envío de correos electrónicos

// Función para cancelar reservas
async function cancelReservations(reservationIds) {
    try {
        // Realiza la cancelación de reservas en una transacción para mantener la integridad de los datos
        await pool.query('BEGIN');

        for (const reservationId of reservationIds) {
            // Consulta la reserva para obtener información adicional si es necesario
            const reservationQuery = 'SELECT * FROM Reservas WHERE id = $1';
            const reservationValues = [reservationId];
            const reservationResult = await pool.query(reservationQuery, reservationValues);

            if (reservationResult.rows.length === 0) {
                throw new Error(`Reserva con ID ${reservationId} no encontrada`);
            }

            // Realiza la lógica de cancelación aquí (por ejemplo, actualiza el estado de la reserva)
            // Supongamos que el estado 'cancelado' se usa para marcar una reserva como cancelada
            const updateReservationQuery = 'UPDATE Reservas SET estado = $1 WHERE id = $2';
            const updateReservationValues = ['cancelado', reservationId];
            await pool.query(updateReservationQuery, updateReservationValues);

            // Obtiene infrmación del usuario asociado a la reserva (puedes adaptar esto según tu base de datos)
            const queryUser = 'SELECT nombre, email FROM usuarios WHERE user_id =$1'

            const userInfo = await pool.query(queryUser, reservationResult.rows[0].user_id);
            if (userInfo) {
                const email = userInfo.email;
                const nombre = userInfo.nombre;
                const fecha = reservationResult.rows[0].fecha_reserva;

                // Envía el correo electrónico de cancelación
                await sendCancellationEmail(email, nombre, fecha);
            }


        }

        // Confirma la transacción
        await pool.query('COMMIT');
        return { success: true, message: 'Reservas canceladas con éxito' };

    } catch (error) {
        // En caso de error, realiza un rollback de la transacción
        await pool.query('ROLLBACK');

        console.error('Error al cancelar reservas:', error);
        return { success: false, message: 'Error al cancelar reservas' };
    }
}

// Función para aprobar reservas
async function approveReservations(reservationIds) {
    try {
        // Realiza la aprobación de reservas en una transacción para mantener la integridad de los datos
        await pool.query('BEGIN');

        for (const reservationId of reservationIds) {
            // Consulta la reserva para obtener información adicional si es necesario
            const reservationQuery = 'SELECT * FROM Reservas WHERE id = $1';
            const reservationValues = [reservationId];
            const reservationResult = await pool.query(reservationQuery, reservationValues);

            if (reservationResult.rows.length === 0) {
                throw new Error(`Reserva con ID ${reservationId} no encontrada`);
            }

            // Realiza la lógica de aprobación aquí (por ejemplo, actualiza el estado de la reserva)
            // Supongamos que el estado 'aprobado' se usa para marcar una reserva como aprobada
            const updateReservationQuery = 'UPDATE Reservas SET estado = $1 WHERE id = $2';
            const updateReservationValues = ['aprobado', reservationId];
            await pool.query(updateReservationQuery, updateReservationValues);

            // Obtiene información del usuario asociado a la reserva (puedes adaptar esto según tu base de datos)
            const query2 = 'SELECT nombre, email FROM usuarios WHERE user_id =$1'
            const userInfo = await pool.query(query2, reservationResult.rows[0].user_id);
            const profesor = await pool.query(query2, reservationResult.rows[0].profesor_id);
            if (userInfo && profesor) {
                const email = userInfo.email;
                const nombre = userInfo.nombre;
                const fecha = reservationResult.rows[0].fecha_reserva;
                const profesorName = profesor.rows[0].nombre;

                // Envía el correo electrónico de aprobación
                await sendApprovalEmail(email, nombre, profesorName, fecha);
            }
        }


        // Confirma la transacción
        await pool.query('COMMIT');
        return { success: true, message: 'Reservas aprobadas con éxito' };

    } catch (error) {
        // En caso de error, realiza un rollback de la transacción
        await pool.query('ROLLBACK');

        console.error('Error al aprobar reservas:', error);
        return { success: false, message: 'Error al aprobar reservas' };
    }
}



async function getReservationsByDateRange(profesorId, startDate, endDate) {
    try {
        // Consulta las reservas dentro del rango de fechas para un profesor específico
        const query = 'SELECT reserva_id FROM Reservas WHERE profesor_id = $1 AND fecha_reserva >= $2 AND fecha_reserva <= $3';
        const values = [profesorId, startDate, endDate];
        const reservationsToCancel = await pool.query(query, values);

        console.log('Reservas obtenidas dentro del rango de fechas con éxito');
        return reservationsToCancel.rows;
    } catch (error) {
        console.error('Error al obtener reservas dentro del rango de fechas:', error);
        throw error;
    }
}

module.exports = { cancelReservations, approveReservations, getReservationsByDateRange };
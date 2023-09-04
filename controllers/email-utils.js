require('dotenv').config(); // Carga las variables de entorno desde el archivo .env

const nodemailer = require('nodemailer');

// Configura el transporte de nodemailer con las variables de entorno
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Obtiene el usuario desde las variables de entorno
        pass: process.env.EMAIL_PASS, // Obtiene la contraseña desde las variables de entorno
    },
});
// Configura eltransporte de nodemailer (puedes ajustar esto según tu proveedor de correo)


// Función para enviar un correo electrónico de confirmación de reserva
async function sendConfirmationEmail(email, nombre, profeNombre, fecha_reserva) {
    try {
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: email,
            subject: 'Confirmación de Reserva',
            text: `Hola ${nombre},\n\nTu reserva con ${profeNombre}para la fecha ${fecha_reserva} ha sido confirmada.\n\nGracias por reservar con nosotros.`,
        };

        await transporter.sendMail(mailOptions);

        console.log('Correo electrónico de confirmación enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico de confirmación:', error);
    }
}

// Función para enviar un correo electrónico de cancelación de reserva
async function sendCancellationEmail(email, nombre, fecha_reserva) {
    try {
        const mailOptions = {
            from: 'tu_correo@gmail.com',
            to: email,
            subject: 'Cancelación de Reserva',
            text: `Hola ${nombre},\n\nTu reserva para la fecha ${fecha_reserva} ha sido cancelada.\n\nLamentamos los inconvenientes.`,
        };

        await transporter.sendMail(mailOptions);

        console.log('Correo electrónico de cancelación enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el correo electrónico de cancelación:', error);
    }
}

module.exports = { sendConfirmationEmail, sendCancellationEmail };
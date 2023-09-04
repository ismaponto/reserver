module.exports = (req, res, next) => {
    if (req.isAuthenticated()) {
        // Si el usuario está autenticado, continúa con la siguiente función en la cadena
        return next();
    }

    // Si el usuario no está autenticado, redirige a la página de inicio de sesión o envía una respuesta de error
    return res.status(401).json({ message: 'Acceso no autorizado' });
};
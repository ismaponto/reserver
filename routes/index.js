const express = require('express');
const index = express.Router();

// Importar los enrutadores individuales
const auth = require('./auth');
const admin = require('./admin');
const professor = require('./professor');
const reservas = require('./reservas');
const usuario = require('./usuario');


// // Configurar las rutas utilizando los enrutadores individuales
index.use('/auth', auth);
index.use('/admin', admin);
index.use('/reservas', reservas);
index.use('/usuario', usuario);
index.use('/professor', professor);



// Exportar el enrutador
module.exports = index;
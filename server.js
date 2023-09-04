const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const { comparePassword } = require('./controllers/user-utils')
const app = express();
const cors = require('cors'); // Importa el paquete 'cors'

const port = process.env.PORT || 3000;

// Configuración de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configura CORS como middleware
app.use(cors());

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

//requerimos las estrategias y el middleware
const initLocalStrategy = require('./config/local-strategy');
const initGoogleStrategy = require('./config/google-strategy');
const { getUserByEmail } = require('./controllers/user-utils'); // Importa la función
const { createUserFromGoogleProfile } = require('./controllers/google-utils'); // Importa la función

// Configuración de estrategia local
initLocalStrategy(passport, getUserByEmail, comparePassword);

// Configuración de estrategia de Google OAuth2
initGoogleStrategy(passport, getUserByEmail, createUserFromGoogleProfile);


// Serialización y deserialización de usuario (adapta según tu modelo de datos)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    // Aquí busca y devuelve el usuario desde la base de datos
});

// Rutas
const index = require('./routes/index');
app.use('/', index);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
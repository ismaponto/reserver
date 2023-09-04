const LocalStrategy = require('passport-local').Strategy;
const { comparePassword } = require('../controllers/user-utils')

const initLocalStrategy = (passport, getUserByEmail, comparePassword) => {
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
        },
        async(email, password, done) => {
            try {
                const user = await getUserByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado.' });
                }

                if (!comparePassword(password, user.contraseña_hash)) {
                    return done(null, false, { message: 'Contraseña incorrecta.' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

module.exports = initLocalStrategy;
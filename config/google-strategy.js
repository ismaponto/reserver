const GoogleStrategy = require('passport-google-oauth20').Strategy;

const initGoogleStrategy = (passport, getUserByEmail, createUserFromGoogleProfile) => {
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        async(accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                let user = await getUserByEmail(email);

                if (!user) {
                    user = await createUserFromGoogleProfile(profile);
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

module.exports = initGoogleStrategy;
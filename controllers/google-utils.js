async function createUserFromGoogleProfile(profile) {
    const user = {
        email: profile.emails[0].value,
        nombre: profile.name.givenName,
        apellido: profile.name.familyName,
        es_usuario_google: true,
        // Resto de la información según tus necesidades
    };

    return user;
}

module.exports = { createUserFromGoogleProfile };
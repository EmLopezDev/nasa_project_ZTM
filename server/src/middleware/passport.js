const config = require("../config");

const AUTH_OPTIONS = {
    callbackURL: "/v1/auth/google/callback",
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log("GOOGLE PROFILE", profile);
    return done(null, profile);
}

module.exports = { AUTH_OPTIONS, verifyCallback };

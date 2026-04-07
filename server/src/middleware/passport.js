const config = require("../config");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");

const AUTH_OPTIONS = {
    callbackURL: "/v1/auth/google/callback",
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    scope: ["email", "profile"],
};

function verifyCallback(accessToken, refreshToken, profile, done) {
    done(null, profile);
}

passport.serializeUser((user, done) => {
    const { name, emails, photos } = user;
    const userObj = {
        first_name: name.givenName,
        last_name: name.familyName,
        email: emails[0].value,
        photo: photos[0].value,
    };
    done(null, userObj);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

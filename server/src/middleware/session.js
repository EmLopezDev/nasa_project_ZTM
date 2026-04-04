const cookieSession = require("cookie-session");
const config = require("../config");

const sessionMiddleware = (req, _res, next) => {
    cookieSession(
        {
            name: config.COOKIE_NAME,
            maxAge: config.COOKIE_MAX_AGE,
            keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
        },
        (err) => {
            if (err) return next(err);
            if (req.session && !req.session.regenerate) {
                req.session.regenerate = (callback) => {
                    callback();
                };
            }

            if (req.session && !req.session.save) {
                req.session.save = (callback) => {
                    callback();
                };
            }
            next();
        },
    );
    next();
};

module.exports = { sessionMiddleware };

const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api");
const helmet = require("helmet");
const passport = require("passport");
const expressSession = require("express-session");
const config = require("./config");
const { Strategy } = require("passport-google-oauth20");
const { AUTH_OPTIONS, verifyCallback } = require("./middleware/passport");

const app = express();

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

app.use(helmet());
app.use(
    cors({
        origin: ["https://localhost:3000", "https://localhost:8000"],
        credentials: true,
    }),
);

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

app.use(
    expressSession({
        name: config.COOKIE_NAME,
        secret: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: Number(config.COOKIE_MAX_AGE),
            sameSite: "none",
        },
    }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);
app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;

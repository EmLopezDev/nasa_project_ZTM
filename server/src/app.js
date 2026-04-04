const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api");
const helmet = require("helmet");
const passport = require("passport");
const cookieSession = require("cookie-session");
const config = require("./config");
const { Strategy } = require("passport-google-oauth20");
const { AUTH_OPTIONS, verifyCallback } = require("./middleware/passport");
// const { checkLoggedIn } = require("./middleware/auth");

const app = express();

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

app.use(helmet());
app.use(
    cors({
        origin: "https://localhost:3000",
        credentials: true,
    }),
);
app.use(
    cookieSession({
        name: config.COOKIE_NAME,
        maxAge: config.COOKIE_MAX_AGE,
        keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
        secure: true,
        sameSite: "none",
    }),
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    console.log("SERIALIZE-USER", user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    console.log("DESERIALIZE-USER", user);
    done(null, user);
});

app.use((req, _res, next) => {
    if (req.session && !req.session.regenerate) {
        req.session.regenerate = (cb) => {
            cb();
        };
    }
    if (req.session && !req.session.save) {
        req.session.save = (cb) => {
            cb();
        };
    }
    next();
});

app.get(
    "/v1/auth/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    }),
);
app.get(
    "/v1/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/v1/auth/failure",
        successRedirect: "https://localhost:3000",
        session: true,
    }),
);
app.get("/v1/auth/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect("https://localhost:3000");
});
app.get("/v1/auth/failure", (req, res) => {
    res.status(401).json({ error: "Failed to log in!" });
});

app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", api);
app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;

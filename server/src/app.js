const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const api = require("./routes/api");
const helmet = require("helmet");
const passport = require("passport");
const expressSession = require("express-session");
const config = require("./config");
require("./middleware/passport");

const app = express();

app.use(helmet());
app.use(
    cors({
        origin: ["https://localhost:3000", "https://localhost:8000"],
        credentials: true,
    }),
);

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

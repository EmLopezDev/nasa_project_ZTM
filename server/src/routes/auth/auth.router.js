const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
require("dotenv").config();

const authRouter = express.Router();

const config = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const AUTH_OPTIONS = {
    callbackURL: "/v1/auth/google/callback",
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
};

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log("GOOGLE PROFILE", profile);
    return done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] }),
    (req, res) => {
        console.log("GOOGLE");
    },
);
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/failure",
        successRedirect: "/launch",
        session: false,
    }),
    (req, res) => {
        console.log("GOOGLE CALLBACK SUCCESS");
    },
);
authRouter.get("/logout", (req, res) => {});
authRouter.get("/failure", (req, res) => {
    res.status(401).json({ error: "Failed to log in!" });
});

module.exports = authRouter;

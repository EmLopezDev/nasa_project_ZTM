const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const { AUTH_OPTIONS, verifyCallback } = require("../../middleware/passport");

const authRouter = express.Router();

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
        successRedirect: "/",
        session: false,
    }),
    (req, res) => {
        console.log(req.body);
        console.log("GOOGLE CALLBACK SUCCESS");
    },
);
authRouter.get("/logout", (req, res) => {});
authRouter.get("/failure", (req, res) => {
    res.status(401).json({ error: "Failed to log in!" });
});

module.exports = authRouter;

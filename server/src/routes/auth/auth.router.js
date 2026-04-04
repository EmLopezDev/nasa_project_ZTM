const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

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

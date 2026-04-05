const express = require("express");
const passport = require("passport");

const authRouter = express.Router();

authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    }),
);
authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/v1/auth/failure",
        successRedirect: "https://localhost:3000",
        session: true,
    }),
);
authRouter.get("/v1/auth/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.redirect("https://localhost:3000");
});
authRouter.get("/v1/auth/failure", (req, res) => {
    res.status(401).json({ error: "Failed to log in!" });
});

module.exports = authRouter;

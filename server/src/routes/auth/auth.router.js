const express = require("express");

const authRouter = express.Router();

authRouter.get("/google", (req, res) => {});
authRouter.get("/google/callback", (req, res) => {});
authRouter.get("/logout", (req, res) => {});

module.exports = authRouter;

const express = require("express");
const planetsRouter = require("./planets/planets.router");
const launchesRouter = require("./launches/launches.router");
const authRouter = require("./auth/auth.router");
const { checkLoggedIn } = require("../middleware/auth");

const api = express.Router();

api.use("/auth", authRouter);
api.use("/planets", checkLoggedIn, planetsRouter);
api.use("/launches", checkLoggedIn, launchesRouter);

module.exports = api;

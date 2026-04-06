function checkLoggedIn(req, res, next) {
    // TODO: change logic to check for (req.isAuthenticated() && req.user) instead when ready
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(401).json({ error: "You must log in!" });
    }
    next();
}

module.exports = { checkLoggedIn };

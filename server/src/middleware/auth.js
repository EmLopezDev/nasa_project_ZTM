function checkLoggedIn(_req, res, next) {
    // TODO: change logic to check for req.user instead when ready
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(401).json({ error: "You must log in!" });
    }
    next();
}

module.exports = { checkLoggedIn };

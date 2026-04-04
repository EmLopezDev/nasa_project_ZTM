function checkLoggedIn(req, res, next) {
    console.log("REQ USER ====>", req.user);
    if (!req.user) {
        return res.status(401).json({ error: "You must log in!" });
    }
    next();
}

module.exports = { checkLoggedIn };

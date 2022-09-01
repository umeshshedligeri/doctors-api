const jwt = require("jsonwebtoken");

const config = require("../config/application");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.send({
            status: 403,
            success: false,
            message: "A token is required for authentication"
        });
        // return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.secret_key);
        req.user = decoded;
    } catch (err) {
        return res.send({
            status: 401,
            success: false,
            message: "Invalid Token"
        });
        // return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;
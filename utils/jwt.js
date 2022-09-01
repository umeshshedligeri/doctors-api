const jwt = require("jsonwebtoken");
const Config = require("../config/application");

const generateJwt = (data) => {
    return jwt.sign(data, Config.secret_key);
}

module.exports = generateJwt;
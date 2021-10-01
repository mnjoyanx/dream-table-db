const jwt = require('jsonwebtoken');
const fs = require('fs');
const { ERROR } = require("./index");

const CONFIG = require("../config").JWT;

function getPrivateKey() {
    return "" //fs.readFileSync(CONFIG.PRIVATE_KEY, 'utf-8');
}

function getPublicKey() {
    return "" //fs.readFileSync(CONFIG.PUBLIC_KEY, 'utf-8');
}

function validateToken(req, res, next) {
    let token = req.body.token || req.params.token || req.query.token || req.headers.authorization;
    Verify(token, req, res, next);
}

function Verify(token, req, res, next) {

    if (!token) return ERROR(res, "Forbiden");

    let options = { algorithm: "RS256", };

    jwt.verify(token, getPublicKey(), options, async function (err, decode) {

        if (err) return ERROR(res, "Forbiden");

        next();

    });
}

function signToken(data, exp) {

    return new Promise((resolve, rejecet) => {

        let options = {
            expiresIn: "1d",
            algorithm: "RS256",
        };

        if (exp) options.expiresIn = exp;

        jwt.sign(data, getPrivateKey(), options, (err, token) => {

            if (err) return rejecet(err);

            resolve(token);

        });
    });

}

module.exports = {
    signToken,
    validateToken
}

const { sign, verify } = require("jsonwebtoken");
const { atSecretKey, rtSecretKey } = require("../config");

function createTokenPair(data) {
    return {
        accessToken: sign(data, atSecretKey, { expiresIn: "1w" }), refreshToken: sign(data, rtSecretKey, { expiresIn: "4w" }),
    };
}

function createForgotPasswordTokenPair(data) {
    return {
        forgotPasswordToken: sign(data, atSecretKey, { expiresIn: "10m" }),
    };
}

function verifyTokenPair(data) {
    return verify(data, atSecretKey)
}

module.exports = { createTokenPair, createForgotPasswordTokenPair, verifyTokenPair };
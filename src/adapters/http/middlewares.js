const { validationResult } = require('express-validator');
const { verifyToken } = require('../../utils/generateToken');

// eslint-disable-next-line consistent-return
const validRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    next();
};

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokeData = await verifyToken(token);
        if (tokeData.id) {
            next();
        } else {
            res.status(409);
            res.send({ error: 'No tienes autorización' });
        }
    } catch (error) {
        res.status(409);
        res.send({ error: 'No tienes autorización' });
    }
};

const checkRoleAuth = (role) => async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokeData = await verifyToken(token);
        if (tokeData.role === role) {
            next();
        } else {
            res.status(409);
            res.send({ error: 'No tienes autorización' });
        }
    } catch (error) {
        res.status(409);
        res.send({ error: 'No tienes autorización' });
    }
};

module.exports = {
    validRequest,
    checkAuth,
    checkRoleAuth,
};

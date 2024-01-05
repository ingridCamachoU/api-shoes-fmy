// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');

const tokenSign = async (user) => jwt.sign(
    {
        id: user.id,
        role: user.role,
    },
    process.env.JWT_SECRET,
    {
        expiresIn: '2h',
    },
);

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { tokenSign, verifyToken };

// eslint-disable-next-line import/no-extraneous-dependencies
const bcrypt = require('bcryptjs');

const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash;
};

const compare = async (passwordPlain, hashPassword) => bcrypt.compare(passwordPlain, hashPassword);

module.exports = { encrypt, compare };

const process = require('process');
require('dotenv').config();

const getEnv = (name, required) => {
    const env = process.env[name];

    if (env == null && required) {
        console.error(`[error] No ${name} environment variable in .env file`);
        process.exit(1);
    }

    return env || null;
};

const vars = {
    PORT: getEnv('PORT', true),
    DB_HOST: getEnv('DB_HOST', true),
    DB_PORT: getEnv('DB_PORT', true),
    DB_NAME: getEnv('DB_NAME', true),
    DB_USERNAME: getEnv('DB_USERNAME', true),
    DB_PASSWORD: getEnv('DB_PASSWORD', true),
    NODE_ENV: getEnv('NODE_ENV', false),
};

module.exports = vars;

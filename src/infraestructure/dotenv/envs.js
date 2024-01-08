require('dotenv').config();

const getEnv = (name, required) => {
    const env = process.env[name];

    if (env == null && required) {
        console.error(`[error] No ${name} environment variable in .env file`);
        process.exit(1);
    }
    console.log(env);

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

/* const vars = {
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    NODE_ENV: process.env.PORT || 8080,
}; */

module.exports = vars;

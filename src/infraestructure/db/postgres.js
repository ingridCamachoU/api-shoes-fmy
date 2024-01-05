const { Sequelize } = require('sequelize');

class Postgres {
    // eslint-disable-next-line no-restricted-syntax
    constructor(user, password, database, host, port) {
        this.user = user;
        this.password = password;
        this.database = database;
        this.host = host;
        this.port = port;
    }

    connect = async () => {
        this.postgresClient = new Sequelize({
            username: this.user,
            password: this.password,
            database: this.database,
            host: this.host,
            port: this.port,
            dialect: 'postgres',
            logging: true,
            dialectOptions: {
                ssl: true,
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
    };

    checkConnection = async () => new Promise((resolve) => {
        try {
            this.postgresClient.authenticate();
            // eslint-disable-next-line no-console
            console.log('Connection has been established successfully.');
            resolve();
        } catch (error) {
            throw new Error('Unable to connect to the database:', error);
        }
    });
}

const createPostgresClient = async (
    user,
    password,
    database,
    host,
    port,
) => {
    const postgres = new Postgres(user, password, database, host, port);
    await postgres.connect();
    await postgres.checkConnection();
    return postgres.postgresClient;
};

module.exports = {
    createPostgresClient,
};

const express = require('express');
const cors = require('cors');

class Server {
    // eslint-disable-next-line no-restricted-syntax
    constructor() {
        this.app = express();
        this.middlewares();
    }

    middlewares = () => {
        this.app.use(cors());
        this.app.use(express.json());
    };

    addRouter = (version, router) => {
        this.app.use(version, router);
    };

    listen = (port) => {
        this.app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Listening on port ${port}`);
        });
    };
}

module.exports = Server;

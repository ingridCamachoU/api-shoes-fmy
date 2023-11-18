import express from 'express';
import config from './config.js';
import routerApi from './routes/index.js';

const app = express();

//configuracion
app.set('port', config.port);

//rutas
routerApi(app);

export default app;

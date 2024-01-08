// const env = require('./src/infraestructure/dotenv/envs');

const Server = require('./src/infraestructure/express/express-server');

/**
 * Postgresql
 */
const { createPostgresClient } = require('./src/infraestructure/db/postgres');

/**
 * Repositories
 */
const PostgresRepositoryCategory = require('./src/adapters/repositories/postgres/postgres-repository-category');
const PostgresRepositoryProduct = require('./src/adapters/repositories/postgres/postgres-repository-product');
const PostgresRepositoryUser = require('./src/adapters/repositories/postgres/postgres-repository-user');
const PostgresRepositoryOrder = require('./src/adapters/repositories/postgres/postgres-repository-order');

/**
 * Config Routers
 */
const ConfigureRouterCategory = require('./src/adapters/http/category/http-category-router');
const ConfigureRouterProduct = require('./src/adapters/http/product/http-product-router');
const ConfigureRouterUser = require('./src/adapters/http/user/http-user-router');
const ConfigureRouterOrder = require('./src/adapters/http/order/http-order-router');

/**
 * UseCases
  */
const UseCasesCategory = require('./src/application/usecases/usecases-category');
const UseCasesProduct = require('./src/application/usecases/usecases-product');
const UseCasesUser = require('./src/application/usecases/usecases-user');
const UseCasesOrder = require('./src/application/usecases/usecases-order');

/* (async () => {
    const postgresClient = await createPostgresClient(
        env.DB_USERNAME,
        env.DB_PASSWORD,
        env.DB_NAME,
        env.DB_HOST,
        env.DB_PORT,
    );
    const server = new Server();

    // categories
    const postgresRepositoryCategory = new PostgresRepositoryCategory(
        postgresClient,
    );
    const useCasesCategory = new UseCasesCategory(postgresRepositoryCategory);
    const configureCategoryRouter = new ConfigureRouterCategory(
        useCasesCategory,
    );
    const routerCategory = configureCategoryRouter.setRouter();
    server.addRouter('/api/v1/categories', routerCategory);

    // products
    const postgresRepositoryProduct = new PostgresRepositoryProduct(
        postgresClient,
    );
    const useCasesProduct = new UseCasesProduct(postgresRepositoryProduct);
    const configureProductRouter = new ConfigureRouterProduct(
        useCasesProduct,
    );
    const routerProduct = configureProductRouter.setRouter();
    server.addRouter('/api/v1/products', routerProduct);

    // user
    const postgresRepositoryUser = new PostgresRepositoryUser(
        postgresClient,
    );
    const useCasesUser = new UseCasesUser(postgresRepositoryUser);
    const configureUserRouter = new ConfigureRouterUser(
        useCasesUser,
    );
    const routerUser = configureUserRouter.setRouter();
    server.addRouter('/api/v1/users', routerUser);

    // order
    const postgresRepositoryOrder = new PostgresRepositoryOrder(
        postgresClient,
    );
    const useCasesOrder = new UseCasesOrder(postgresRepositoryOrder);
    const configureOrderRouter = new ConfigureRouterOrder(useCasesOrder);
    const routerOrder = configureOrderRouter.setRouter();
    server.addRouter('/api/v1/orders', routerOrder);

    server.listen(env.PORT);
})();
 */

const server = new Server();
const express = require("express");

require('dotenv').config();

const routerOrder = express.Router();
routerOrder.get('/', (req, res) => {
    res.send('Hola mi server en express');
});
server.addRouter('/api/v1/books', routerOrder);

server.listen(process.env.PORT);

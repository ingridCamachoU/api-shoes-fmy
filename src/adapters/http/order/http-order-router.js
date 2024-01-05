const express = require('express');

const { check } = require('express-validator');

const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersOrder = require('./http-order-handlers');

module.exports = class ConfigureRouterOrder {
    constructor(orderUseCases) {
        this.orderUseCases = orderUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const orderHandlers = new HandlersOrder(
            this.orderUseCases,
        );
        this.router.get('/', checkAuth, orderHandlers.getOrdersHandler);

        this.router.get(
            '/:id/',
            checkAuth,
            [
                check('id', 'id is required').not().isEmpty(),
                validRequest,
            ],
            orderHandlers.getDetailOrdertHandler,
        );

        this.router.post(
            '/',
            checkAuth,
            [
                check('order.user_id', 'usuario is required').not().isEmpty(),
                check('products', 'productos is required').not().isEmpty(),
                validRequest,
            ],
            orderHandlers.postOrderHandler,
        );

        this.router.put(
            '/:id/',
            checkAuth,
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const order = await this.orderUseCases.getOrderUseCase(
                        parseInt(id, 10),
                    );
                    if (!order) throw new Error(`this order id ${id}, not exists...`);
                }),
                validRequest,
            ],
            orderHandlers.putOrderHandler,
        );

        this.router.delete(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const order = await this.orderUseCases.getOrderUseCase(
                        parseInt(id, 10),
                    );
                    if (!order) throw new Error(`this order id ${id}, not exists...`);
                    if (order?.deleted_at !== null) throw new Error(`this order id ${id}, was removed...`);
                }),
                validRequest,
            ],
            orderHandlers.deleteOrderHandler,
        );

        return this.router;
    }
};

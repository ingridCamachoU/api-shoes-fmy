const express = require('express');

const { check, checkExact, body } = require('express-validator');

const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersProduct = require('./http-product-handlers');

module.exports = class ConfigureRouterProduct {
    constructor(productUseCases) {
        this.productUseCases = productUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const productHandlers = new HandlersProduct(
            this.productUseCases,
        );
        this.router.get(
            '/',
            productHandlers.getProductsHandler,
        );

        this.router.get(
            '/:id/',
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                    if (product?.deleted_at) throw new Error(`this product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            productHandlers.getProductHandler,
        );

        this.router.post(
            '/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('code', 'code is required').not().isEmpty(),
                check('name', 'name is required').not().isEmpty(),
                check('price', 'price is required').not().isEmpty(),
                checkExact([
                    body('price').isNumeric(),
                    body('stock').isNumeric(),
                    body('category').isNumeric(),
                    body('images').isURL(),
                    body('code').isLength({ min: 4 }),
                    body('color').isLength({ min: 3 }),
                    body('price').isLength({ min: 3 }),
                    body('description').isLength({ min: 3 }),
                    body('description').isLength({ min: 4 }),
                    body('gender').isLength({ min: 4 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            productHandlers.postProductHandler,
        );

        this.router.put(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            productHandlers.putProductHandler,
        );

        this.router.post(
            '/size/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                }),
                validRequest,
            ],
            productHandlers.postSizeNewProductHandler,
        );

        this.router.delete(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const product = await this.productUseCases.getProductUseCase(
                        parseInt(id, 10),
                    );
                    if (!product) throw new Error(`this product id ${id}, not exists...`);
                    if (product?.deleted_at !== null) throw new Error(`this product id ${id}, was removed...`);
                }),
                validRequest,
            ],
            productHandlers.deleteProductHandler,
        );

        return this.router;
    }
};

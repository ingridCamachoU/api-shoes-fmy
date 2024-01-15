const express = require('express');
const { check, checkExact, body } = require('express-validator');

const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersSize = require('./http-size-handlers');

module.exports = class ConfigureRouterSize {
    constructor(sizeUseCases) {
        this.sizeUseCases = sizeUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const sizeHandlers = new HandlersSize(
            this.sizeUseCases,
        );
        this.router.get(
            '/',
            sizeHandlers.getSizeHandler,
        );

        this.router.post(
            '/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('number', 'number is required').not().isEmpty(),
                checkExact([body('number').isNumeric()], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            sizeHandlers.postSizeHandler,
        );

        this.router.put(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const size = await this.sizeUseCases.getSizeUseCase(
                        parseInt(id, 10),
                    );
                    if (!size) throw new Error(`this size id ${id}, not exists...`);
                }),
                validRequest,
            ],
            sizeHandlers.putSizeHandler,
        );

        this.router.delete(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const size = await this.sizeUseCases.getSizeUseCase(
                        parseInt(id, 10),
                    );
                    if (!size) throw new Error(`this size id ${id}, not exists...`);
                    if (size?.deleted_at !== null) throw new Error(`this size id ${id}, was removed...`);
                }),
                validRequest,
            ],
            sizeHandlers.deleteSizeHandler,
        );

        return this.router;
    }
};

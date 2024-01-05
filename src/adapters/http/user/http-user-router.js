const { check, checkExact, body } = require('express-validator');
const express = require('express');
const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersUser = require('./http-user-handlers');

module.exports = class ConfigureRouterProvider {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const userHandlers = new HandlersUser(
            this.userUseCase,
        );
        this.router.get(
            '/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            userHandlers.getUserHandler,
        );

        this.router.get(
            '/:id/',
            checkAuth,
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                    if (user?.deleted_at) throw new Error(`this user id ${id}, not exists...`);
                }),
                validRequest,
            ],
            userHandlers.getUserHandler,
        );

        // create user
        this.router.post(
            '/',
            [
                check('cc', 'cc is required').not().isEmpty(),
                check('name', 'name is required').not().isEmpty(),
                check('phone', 'phone is required').not().isEmpty(),
                check('email', 'email is required').not().isEmpty(),
                check('password', 'password is required').not().isEmpty(),
                check('address', 'address is required').not().isEmpty(),
                checkExact([
                    body('email').isEmail(),
                    body('cc').isNumeric(),
                    body('phone').isNumeric(),
                    body('role').isString(),
                    body('cc').isLength({ min: 8 }),
                    body('phone').isLength({ min: 7 }),
                    body('name').isLength({ min: 3 }),
                    body('password').isLength({ min: 6 }),
                    body('role').isLength({ min: 3 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            userHandlers.postUserHandler,
        );

        // Login
        this.router.post(
            '/login/',
            [
                check('email', 'email is required').not().isEmpty(),
                check('password', 'password is required').not().isEmpty(),
                checkExact([
                    body('email').isEmail(),
                    body('password').isLength({ min: 6 })], {
                    message: 'Too many fields specified',
                }),
                check('email').custom(async (email) => {
                    const user = await this.userUseCase.getUserByEmailUseCase(email);
                    if (!user) throw new Error(`this user email ${email}, not exists...`);
                }),
                validRequest,
            ],
            userHandlers.postLoginHandler,
        );

        this.router.put(
            '/:id/',
            checkAuth,
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                }),
                validRequest,
            ],
            userHandlers.putUserHandler,
        );

        this.router.delete(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const user = await this.userUseCase.getUserUseCase(
                        parseInt(id, 10),
                    );
                    if (!user) throw new Error(`this user id ${id}, not exists...`);
                    if (user?.deleted_at !== null) throw new Error(`this user id ${id}, was removed...`);
                }),
                validRequest,
            ],
            userHandlers.deleteUserHandler,
        );

        return this.router;
    }
};

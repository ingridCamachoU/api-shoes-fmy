const express = require('express');
const { check, checkExact, body } = require('express-validator');

const { validRequest, checkAuth, checkRoleAuth } = require('../middlewares');
const HandlersCategory = require('./http-category-handlers');

module.exports = class ConfigureRouterCategory {
    constructor(categoryUseCases) {
        this.categoryUseCases = categoryUseCases;
        this.router = null;
    }

    setRouter() {
        this.router = express.Router();
        const categoryHandlers = new HandlersCategory(
            this.categoryUseCases,
        );
        this.router.get(
            '/',
            categoryHandlers.getCategoriesHandler,
        );

        this.router.post(
            '/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('name', 'name is required').not().isEmpty(),
                checkExact([body('name').isLength({ min: 3 })], {
                    message: 'Too many fields specified',
                }),
                validRequest,
            ],
            categoryHandlers.postCategoryHandler,
        );

        this.router.put(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const category = await this.categoryUseCases.getCategoryUseCase(
                        parseInt(id, 10),
                    );
                    if (!category) throw new Error(`this category id ${id}, not exists...`);
                }),
                validRequest,
            ],
            categoryHandlers.putCategoryHandler,
        );

        this.router.delete(
            '/:id/',
            checkAuth,
            checkRoleAuth(process.env.PERMISSIONS),
            [
                check('id', 'id is required').not().isEmpty(),
                check('id').custom(async (id) => {
                    const category = await this.categoryUseCases.getCategoryUseCase(
                        parseInt(id, 10),
                    );
                    if (!category) throw new Error(`this category id ${id}, not exists...`);
                    if (category?.deleted_at !== null) throw new Error(`this category id ${id}, was removed...`);
                }),
                validRequest,
            ],
            categoryHandlers.deleteCategoryHandler,
        );

        return this.router;
    }
};

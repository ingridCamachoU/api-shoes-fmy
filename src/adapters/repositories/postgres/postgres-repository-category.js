const { Op } = require('sequelize');
const moment = require('moment-timezone');

const {
    CategoryModel,
} = require('./models/category-model');

class PostgresRepositoryCategory {
    constructor(client) {
        this.client = client;
        this.categoryModel = CategoryModel(this.client);
    }

    getCategoryRepository(id) {
        try {
            return this.client.models.categories.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllCategoryRepository() {
        try {
            const result = await this.client.models.categories.findAll({
                where: { deleted_at: { [Op.is]: null } },
                attributes: [
                    'id',
                    'name',
                ],
                order: [['name', 'ASC']],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createCategoryRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.categories.create({
                name: payload.name,
                created_at: now,
                updated_at: now,
            });
            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateCategoryRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.categories.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set marks completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteCategoryRepository(id) {
        try {
            return await this.client.models.categories.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete marks: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryCategory;

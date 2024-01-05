const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { ProductModel } = require('./models/product-model');
const { CategoryModel } = require('./models/category-model');

class PostgresRepositoryProducts {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.categoryModel = CategoryModel(this.client);
        this.productModel = ProductModel(this.client, this.categoryModel);
    }

    // get product
    async getProductRepository(id) {
        try {
            return this.client.models.products.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    // get one product with the parameters
    async getOneProductRepository(id) {
        try {
            const result = await this.client.models.products.findAll({
                where: { id, deleted_at: { [Op.is]: null } },
                include: [
                    {
                        model: this.categoryModel,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'code',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'color',
                    'talla',
                    'images',
                ],
            });
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async getAllProductRepository(query) {
        try {
            const {
                search,
                category,
            } = query;
            const searchFields = ['name', 'description', 'code', '$category.name$'];
            const options = {
                include: [
                    {
                        model: this.categoryModel,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'code',
                    'name',
                    'description',
                    'price',
                    'stock',
                    'color',
                    'talla',
                    'images',
                ],

                where: {
                    deleted_at: { [Op.is]: null },
                },
                order: [['name', 'ASC']],
            };

            // search products by name, description, code, category, mark, model
            if (search) {
                options.where[Op.or] = searchFields.reduce((acc, field) => {
                    acc[field] = { [Op.iLike]: `%${search}%` };
                    return acc;
                }, {});
            }
            // filter products by category, mark and model
            if (category) options.where['$category.name$'] = { [Op.iLike]: `%${category}%` };

            const result = await this.client.models.products.findAll(options);
            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createProductRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.products.create({
                category_id: payload.category,
                code: payload.code,
                name: payload.name,
                description: payload.description,
                price: payload.price,
                stock: payload.stock,
                images: payload.images,
                color: payload.color,
                talla: payload.talla,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateProductRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.products.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteProductRepository(id) {
        try {
            return {
                data: await this.client.models.products.update(
                    {
                        deleted_at: moment().tz('UTC'),
                    },
                    {
                        where: { id },
                    },
                ),
                statusCode: 204,
            };
        } catch (error) {
            console.log(`Sequelize error in delete products: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryProducts;

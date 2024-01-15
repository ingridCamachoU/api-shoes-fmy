const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { ProductModel } = require('./models/product-model');
const { CategoryModel } = require('./models/category-model');
const { SizeModel } = require('./models/size-model');
const { SizeProductModel } = require('./models/size-product-model');

class PostgresRepositoryProducts {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.categoryModel = CategoryModel(this.client);
        this.sizeModel = SizeModel(this.client);
        this.productModel = ProductModel(this.client, this.categoryModel);
        this.sizeProductModel = SizeProductModel(this.client, this.sizeModel, this.productModel);
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
            const sizeInfo = await this.client.models.sizes_products.findAll({
                where: {
                    product_id: id,
                    deleted_at: { [Op.is]: null },
                },
                include: [
                    {
                        model: this.sizeModel,
                        as: 'size',
                        attributes: ['number'],
                        order: [['number', 'ASC']],
                    },
                ],
                attributes: [
                    'id',
                    'amount',
                ],
                order: [['size', 'number', 'ASC']],
                raw: true,
            });

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
                    'gender',
                    'images',
                ],
            });

            const product = {
                ...result,
                sizes: sizeInfo,
            };

            return [product, null, 200];
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
                    'gender',
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
                gender: payload.gender,
                created_at: now,
                updated_at: now,
            });
            const createdSizes = await Promise.all(
                payload.sizes.map(async (size) => {
                    const createdSize = await this.client.models.sizes_products.create({
                        amount: size.amount,
                        size_id: size.size_id,
                        product_id: result.id,
                        created_at: now,
                        updated_at: now,
                    });
                    return createdSize;
                }),
            );
            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createNewSizeProduct(payload, id) {
        try {
            const now = moment().tz('UTC');
            const createdSizes = await Promise.all(
                payload.sizes.map(async (size) => {
                    const sizeProducts = await this.client.models.sizes_products.findAll({
                        where: {
                            product_id: id,
                            size_id: size.size_id,
                        },
                    });
                    console.log(sizeProducts);
                    if (sizeProducts.length === 0) {
                        const createdSize = await this.client.models.sizes_products.create({
                            amount: size.amount,
                            size_id: size.size_id,
                            product_id: id,
                            created_at: now,
                            updated_at: now,
                        });
                        return createdSize;
                    }
                }),
            );
            return [{ data: createdSizes }, null];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);
            return [null, error, 400];
        }
    }

    async updateProductRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            for (const size of payload.sizes) {
                // eslint-disable-next-line no-await-in-loop
                await this.client.models.sizes_products.update(
                    {
                        amount: size.amount,
                        updated_at: now,
                    },
                    {
                        where: {
                            product_id: id,
                            size_id: size.size_id,
                            deleted_at: null,
                            amount: { [Op.ne]: size.amount },
                        },
                    },
                );
            }
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

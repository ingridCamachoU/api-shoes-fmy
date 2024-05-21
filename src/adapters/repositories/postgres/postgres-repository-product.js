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
            const result = await this.productModel.findAll({
                where: { id, deleted_at: { [Op.is]: null } },
                include: [
                    {
                        model: this.sizeModel,
                        as: 'sizes',
                        attributes: ['id', 'number'],
                        through: {
                            attributes: ['amount'],
                        },
                    },
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
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async getAllProductRepository(query) {
        try {
            const {
                search = null,
                category = null,
                priceMin = null,
                priceMax = null,
                color = null,
                gender = null,
                size = null,
            } = query;

            const searchFields = ['name', 'description', 'code', '$category.name$'];

            const options = {
                include: [
                    {
                        model: this.sizeModel,
                        as: 'sizes',
                        attributes: ['id', 'number'],
                        through: {
                            attributes: ['amount'],
                        },
                    },
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

            // search products by name, description, code, category
            if (search) {
                options.where[Op.or] = searchFields.reduce((acc, field) => {
                    acc[field] = { [Op.iLike]: `%${search}%` };
                    return acc;
                }, {});
            }

            // filter products by category
            if (category) options.where['$category.id$'] = category;

            // Apply price range filter
            if (priceMin && priceMax) {
                options.where.price = {
                    [Op.between]: [parseFloat(priceMin), parseFloat(priceMax)],
                };
            } else if (priceMin) {
                options.where.price = { [Op.gte]: parseFloat(priceMin) };
            } else if (priceMax) {
                options.where.price = { [Op.lte]: parseFloat(priceMax) };
            }

            // filter products by color
            if (color) options.where.$color$ = { [Op.iLike]: `%${color}%` };

            // filter products by gender
            if (gender) options.where.$gender$ = { [Op.iLike]: `%${gender}%` };

            if (size) options.where['$sizes.id$'] = size;

            const productsWithSizes = await this.productModel.findAll(options);

            return [{ data: productsWithSizes }, null];
        } catch (error) {
            console.log(error);
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
        const transaction = await this.client.transaction();
        try {
            const now = moment().tz('UTC');

            // Verifica si existen tallas para este producto
            const existingSizes = await this.client.models.sizes_products.findAll({
                where: { product_id: id },
                transaction,
            });

            // Si no se envían tallas en el payload, elimina todas las tallas existentes
            if (!payload.sizes || payload.sizes.length === 0) {
                await this.client.models.sizes_products.destroy({
                    where: { product_id: id },
                    transaction,
                });
            } else {
                // Si se envían tallas en el payload, actualiza o elimina según corresponda
                for (const size of existingSizes) {
                    const newSize = payload.sizes.find(s => s.size_id === size.size_id);
                    if (newSize) {
                        // eslint-disable-next-line no-await-in-loop
                        await this.client.models.sizes_products.update(
                            { amount: newSize.amount, updated_at: now },
                            { where: { product_id: id, size_id: size.size_id },transaction},
                        );
                    } else {
                        // Si la talla no existe en el payload, elimina la talla
                        // eslint-disable-next-line no-await-in-loop
                        await this.client.models.sizes_products.destroy({
                            where: { product_id: id, size_id: size.size_id },
                            transaction,
                        });
                    }
                }

                // Agrega nuevas tallas que no existían previamente
                const existingSizeIds = existingSizes.map(size => size.size_id);
                const newSizes = payload.sizes.filter(
                    size => !existingSizeIds.includes(size.size_id)
                );
                if (newSizes.length > 0) {
                    await this.client.models.sizes_products.bulkCreate(
                        newSizes.map(size => ({
                            product_id: id,
                            size_id: size.size_id,
                            amount: size.amount,
                            created_at: now,
                            updated_at: now,
                        })),
                        { transaction },
                    );
                }
            }

            // Actualiza la información del producto
            const result = await this.client.models.products.update(
                { ...payload, updated_at: now },
                { where: { id }, transaction },
            );

            // Confirma la transacción
            await transaction.commit();

            return [result, null, 200];
        } catch (error) {
            // Si hay algún error, revierte la transacción
            await transaction.rollback();
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

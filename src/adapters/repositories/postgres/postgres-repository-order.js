const { Op, Sequelize } = require('sequelize');
const moment = require('moment-timezone');

const { UserModel } = require('./models/user-model');
const { OrderModel } = require('./models/order-model');
const { OrderProductModel } = require('./models/order-product-model');
const { CategoryModel } = require('./models/category-model');
const { ProductModel } = require('./models/product-model');

class PostgresRepositoryOrder {
    // eslint-disable-next-line no-restricted-syntax
    constructor(client) {
        this.client = client;
        this.userModel = UserModel(this.client);
        this.orderModel = OrderModel(this.client, this.userModel);
        this.categoryModel = CategoryModel(this.client);
        this.productModel = ProductModel(this.client, this.categoryModel);
        this.orderProductModel = OrderProductModel(this.client, this.orderModel, this.productModel);
    }

    getOrderRepository(id) {
        try {
            return this.client.models.orders.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllOrdersRepository() {
        try {
            const totals = await this.client.models.orders_products.findAll({
                attributes: [
                    'order_id',
                    [Sequelize.fn('sum', Sequelize.literal('amount * price')), 'total'],
                ],
                group: ['order_id'],
                raw: true,
            });

            const result = await this.client.models.orders.findAll({
                where: { deleted_at: { [Op.is]: null } },
                include: [
                    {
                        model: this.userModel,
                        as: 'user',
                        attributes: ['cc', 'name'],
                    },
                ],
                attributes: [
                    'id',
                    'created_at',
                ],
                order: [['created_at', 'ASC']],
                raw: true,
            });

            const ordersWithTotals = result.map((order) => {
                // eslint-disable-next-line no-shadow
                const total = totals.find((total) => total.order_id === order.id);
                return {
                    ...order,
                    total: total ? total.total : 0,
                };
            });

            return [{ data: ordersWithTotals }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    // Detail order
    async getDetailOrderRepository(id) {
        try {
            const result = await this.client.models.orders_products.findAll({
                where: {
                    order_id: id,
                    deleted_at: { [Op.is]: null },
                },
                include: [
                    {
                        model: this.productModel,
                        as: 'product',
                        attributes: ['id', 'code', 'name', 'price'],
                    },
                ],
                attributes: [
                    'amount',
                    'price',
                ],
            });
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set products completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async createOrderRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const orders = await this.client.models.orders.create({
                user_id: payload.order.user_id,
                created_at: now,
                updated_at: now,
            });

            const createdProducts = await Promise.all(
                payload.products.map(async (product) => {
                    const createdProduct = await this.client.models.orders_products.create({
                        amount: product.amount,
                        price: product.price,
                        order_id: orders.id,
                        product_id: product.product_id,
                        created_at: now,
                        updated_at: now,
                    });
                    return createdProduct;
                }),
            );

            return [{ data: createdProducts }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateOrderRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.orders.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set models completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteOrderRepository(id) {
        try {
            return await this.client.models.orders.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete models: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryOrder;

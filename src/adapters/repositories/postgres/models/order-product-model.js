const { DataTypes } = require('sequelize');

const OrderProductModel = (Client, orderModel, productModel) => {
    const orderProduct = Client.define(
        'orders_products',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            amount: {
                type: DataTypes.INTEGER,
            },
            price: {
                type: DataTypes.INTEGER,
            },
            order_id: {
                type: DataTypes.INTEGER,
            },
            product_id: {
                type: DataTypes.INTEGER,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            timestamps: false,
            freezeTableName: true,
            paranoid: true,

            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        },
    );
    orderModel.hasMany(orderProduct, {
        foreignKey: 'id',
    });
    orderProduct.belongsTo(orderModel, {
        as: 'order',
        foreignKey: 'order_id',
    });

    productModel.hasMany(orderProduct, {
        foreignKey: 'id',
    });
    orderProduct.belongsTo(productModel, {
        as: 'product',
        foreignKey: 'product_id',
    });

    return orderProduct;
};

module.exports = {
    OrderProductModel,
};

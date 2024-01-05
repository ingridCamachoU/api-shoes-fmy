const { DataTypes } = require('sequelize');

const OrderModel = (Client, userModel) => {
    const order = Client.define(
        'orders',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            user_id: {
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
    userModel.hasMany(order, {
        foreignKey: 'id',
    });
    order.belongsTo(userModel, {
        as: 'user',
        foreignKey: 'user_id',
    });

    return order;
};

module.exports = {
    OrderModel,
};

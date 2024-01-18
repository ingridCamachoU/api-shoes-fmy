const { DataTypes } = require('sequelize');

const SizeProductModel = (Client, sizeModel, productModel) => {
    const sizeProductModel = Client.define(
        'sizes_products',
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
            size_id: {
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

    productModel.belongsToMany(sizeModel, {
        through: sizeProductModel,
        foreignKey: 'product_id',
        as: 'sizes',
    });

    sizeModel.belongsToMany(productModel, {
        through: sizeProductModel,
        foreignKey: 'size_id',
        as: 'products',
    });

    return sizeProductModel;
};

module.exports = {
    SizeProductModel,
};

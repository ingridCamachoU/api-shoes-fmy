const { DataTypes } = require('sequelize');

const SizeProductModel = (Client, sizeModel, productModel) => {
    const sizeProduct = Client.define(
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
    sizeModel.hasMany(sizeProduct, {
        foreignKey: 'id',
    });
    sizeProduct.belongsTo(sizeModel, {
        as: 'size',
        foreignKey: 'size_id',
    });

    productModel.hasMany(sizeProduct, {
        foreignKey: 'id',
    });
    sizeProduct.belongsTo(productModel, {
        as: 'product',
        foreignKey: 'product_id',
    });

    return sizeProduct;
};

module.exports = {
    SizeProductModel,
};

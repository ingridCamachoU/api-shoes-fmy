const { DataTypes } = require('sequelize');

const ProductModel = (Client, categoryModel) => {
    const product = Client.define(
        'products',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
                primaryKey: true,
            },
            code: {
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
            },
            description: {
                type: DataTypes.TEXT,
            },
            price: {
                type: DataTypes.INTEGER,
            },
            stock: {
                type: DataTypes.INTEGER,
            },
            images: {
                type: DataTypes.JSON,
            },
            talla: {
                type: DataTypes.INTEGER,
            },
            color: {
                type: DataTypes.STRING,
            },
            category_id: {
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

    categoryModel.hasMany(product, {
        foreignKey: 'id',
    });
    product.belongsTo(categoryModel, {
        as: 'category',
        foreignKey: 'category_id',
    });

    return product;
};

module.exports = {
    ProductModel,
};

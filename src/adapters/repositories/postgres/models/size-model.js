const { DataTypes } = require('sequelize');

const SizeModel = (Client) => Client.define(
    'sizes',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        number: {
            type: DataTypes.STRING,
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

module.exports = {
    SizeModel,
};

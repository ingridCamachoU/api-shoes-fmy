const { DataTypes } = require('sequelize');

const UserModel = (Client) => Client.define(
    'users',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        cc: {
            type: DataTypes.STRING(50),
        },
        name: {
            type: DataTypes.STRING(50),
        },
        phone: {
            type: DataTypes.STRING(30),
        },
        email: {
            type: DataTypes.STRING(100),
        },
        password: {
            type: DataTypes.STRING(80),
        },
        address: {
            type: DataTypes.TEXT,
        },
        role: {
            type: DataTypes.STRING(30),
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
    UserModel,
};

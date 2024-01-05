const { Op } = require('sequelize');
const moment = require('moment-timezone');

const { UserModel } = require('./models/user-model');
const { encrypt, compare } = require('../../../utils/handleBcrypt');
const { tokenSign } = require('../../../utils/generateToken');

class PostgresRepositoryUser {
    constructor(client) {
        this.client = client;
        this.userModel = UserModel(this.client);
    }

    getUserRepository(id) {
        try {
            return this.client.models.users.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    getUserByEmailRepository(email) {
        try {
            return this.client.models.users.findOne({ where: { email } });
        } catch (error) {
            return null;
        }
    }

    async getAllUserRepository() {
        try {
            const result = await this.client.models.users.findAll({
                where: { deleted_at: { [Op.is]: null } },
                attributes: [
                    'id',
                    'cc',
                    'name',
                    'phone',
                    'email',
                    'password',
                    'role',
                    'address',
                ],
                order: [['name', 'ASC']],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createUserRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const passwordHash = await encrypt(payload.password);
            const result = await this.client.models.users.create({
                cc: payload.cc,
                name: payload.name,
                phone: payload.phone,
                email: payload.email,
                password: passwordHash,
                address: payload.address,
                role: payload.role,
                created_at: now,
                updated_at: now,
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async loginUserRepository(payload) {
        try {
            const { email, password } = payload;
            const user = await this.client.models.users.findOne({ where: { email } });
            const checkPassword = await compare(password, user.password);
            const tokenSession = await tokenSign(user);
            if (!checkPassword) {
                const message = {
                    message: 'Invalid password',
                };

                return [message, 409];
            }
            const result = {
                user,
                tokenSession,
            };
            return [result, null];
        } catch (error) {
            return ['Verifique el email o la password', error];
        }
    }

    async updateUserRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.users.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set users completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteUserRepository(id) {
        try {
            return await this.client.models.users.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                { where: { id } },
            );
        } catch (error) {
            console.log(`Sequelize error in delete providers: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositoryUser;

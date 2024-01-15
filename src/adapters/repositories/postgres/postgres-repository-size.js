const { Op } = require('sequelize');
const moment = require('moment-timezone');

const {
    SizeModel,
} = require('./models/size-model');

class PostgresRepositorySize {
    constructor(client) {
        this.client = client;
        this.sizeModel = SizeModel(this.client);
    }

    getSizeRepository(id) {
        try {
            return this.client.models.sizes.findByPk(id);
        } catch (error) {
            return null;
        }
    }

    async getAllSizeRepository() {
        try {
            const result = await this.client.models.sizes.findAll({
                where: { deleted_at: { [Op.is]: null } },
                attributes: [
                    'id',
                    'number',
                ],
                order: [['number', 'ASC']],
            });

            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async createSizeRepository(payload) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.sizes.create({
                number: payload.number,
                created_at: now,
                updated_at: now,
            });
            return [{ data: result }, null];
        } catch (error) {
            return [{ data: [] }, error];
        }
    }

    async updateSizeRepository(payload, id) {
        try {
            const now = moment().tz('UTC');
            const result = await this.client.models.sizes.update(
                {
                    ...payload,
                    updated_at: now,
                },
                { where: { id } },
            );
            return [result, null, 200];
        } catch (error) {
            console.log(`Sequelize error in set marks completed: ${error.parent.sqlMessage}`);

            return [null, error, 400];
        }
    }

    async deleteSizeRepository(id) {
        try {
            return await this.client.models.sizes.update(
                {
                    deleted_at: moment().tz('UTC'),
                },
                {
                    where: { id },
                },
            );
        } catch (error) {
            console.log(`Sequelize error in delete marks: ${error.parent.sqlMessage}`);
            return error;
        }
    }
}

module.exports = PostgresRepositorySize;

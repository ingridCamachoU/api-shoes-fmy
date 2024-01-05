module.exports = class HandlersOrder {
    constructor(orderUseCases) {
        this.orderUseCases = orderUseCases;
    }

    getOrderHandler = async (req, res) => {
        try {
            const { message, code } = await this.orderUseCases.detailOrderUseCase(
                req.query,
            );
            if (code >= 400) return res.status(code).send(message);
            return res.status(code).send({
                ...message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    getOrdersHandler = async (req, res) => {
        try {
            const { message, code } = await this.orderUseCases.getOrdersUseCase(
                req.query,
            );
            if (code >= 400) return res.status(code).send(message);
            return res.status(code).send({
                ...message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    getDetailOrdertHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.orderUseCases.getDetailOrderUseCase(
                parseInt(id, 10),
            );
            if (code >= 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                message,
                data,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    postOrderHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.orderUseCases.createOrderUseCase(
                req.body,
            );
            if (code >= 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                data: message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    putOrderHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.orderUseCases.updateOrderUseCase(req.body, id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                message,
                data,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };

    deleteOrderHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                error = null,
            } = await this.orderUseCases.deleteOrderUseCase(id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                data: message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
            });
        }
    };
};

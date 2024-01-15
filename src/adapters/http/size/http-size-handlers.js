module.exports = class HandlersSize {
    constructor(sizeUseCases) {
        this.sizeUseCases = sizeUseCases;
    }

    getSizeHandler = async (req, res) => {
        try {
            const { message, code } = await this.sizeUseCases.getSizesUseCase(
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

    postSizeHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.sizeUseCases.createSizeUseCase(
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

    putSizeHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.sizeUseCases.updateSizesUseCase(req.body, id);

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

    deleteSizeHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                error = null,
            } = await this.sizeUseCases.deleteSizeUseCase(id);

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

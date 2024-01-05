module.exports = class HandlersCategory {
    constructor(categoryUseCases) {
        this.categoryUseCases = categoryUseCases;
    }

    getCategoriesHandler = async (req, res) => {
        try {
            const { message, code } = await this.categoryUseCases.getCategoriesUseCase(
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

    postCategoryHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.categoryUseCases.createCategoryUseCase(
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

    putCategoryHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.categoryUseCases.updateCategoryUseCase(req.body, id);

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

    deleteCategoryHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                error = null,
            } = await this.categoryUseCases.deletecategoryUseCase(id);

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

module.exports = class HandlersUser {
    constructor(userUseCase) {
        this.userUseCase = userUseCase;
    }

    getUserHandler = async (req, res) => {
        try {
            const { message, code } = await this.userUseCase.getUsersUseCase(
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

    postUserHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.userUseCase.createUserUseCase(
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

    postLoginHandler = async (req, res) => {
        try {
            const {
                message,
                code,
                error = null,
            } = await this.userUseCase.loginUserUseCase(
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

    putUserHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                data,
                error = null,
            } = await this.userUseCase.updateUserUseCase(req.body, id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                message,
                data,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
                err: error,
            });
        }
    };

    deleteUserHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                message,
                code,
                error = null,
            } = await this.userUseCase.deleteUserUseCase(id);

            if (code === 400) return res.status(code).send({ message, error });
            return res.status(code).send({
                data: message,
            });
        } catch (error) {
            return res.status(500).send({
                code: 'fail',
                message: 'there was an internal error',
                err: error,
            });
        }
    };
};

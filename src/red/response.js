const success = (req, res, message = '', status = 200) => {
    res.status(status).send({
        error: false,
        status: status,
        body: message,
    });
};

const error = (req, res, message = 'Error internal', status = 500) => {
    res.status(status).send({
        error: false,
        status: status,
        body: message,
    });
};

export { success, error };

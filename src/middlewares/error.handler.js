//Creamos función que nos hará llegar a un middleware de tipo error:
const logError = (err, req, res, next) => {
    console.error(err); //mostrar el error en servidor para poder monitorearlo
    next(err); //importante para saber que se esta enviando a un middleware de tipo error, si no tiene el error dentro entonces se esta mandando a uno normal
};

// Crear formato para devolverlo al cliente que se complementa con la función anterior:
const errorHandler = (err, req, res, next) => {
    //así no se utilice next en el código se debe poner aqui, ya que un middleware de error tiene los cuatro parámetros
    res.status(500).json({
        message: err.message, //mostrar al cliente el mensaje de error
        stack: err.stack, //mostrar info del error
    });
};

const boomErrorHandler = (err, req, res, next) => {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    } else {
        next(err);
    }
};

// const ormErrorHandler = (err, req, res, next) => {
//     if (err instanceof ValidationError) {
//         res.status(409).json({
//             statusCode: 409,
//             message: err.name,
//             errors: err.errors,
//         });
//     }
//     next(err);
// };

module.exports = { logError, errorHandler, boomErrorHandler }; //exportarlo como modulo

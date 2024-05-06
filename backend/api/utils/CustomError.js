class CustomError extends Error {
    constructor (message, statusCode, errors = []) {
        super(message)
        this.statusCode = statusCode;
        this.status = statusCode <= 400 && statusCode < 500 ? 'fail' : 'error';
        this.errors = Array.isArray(errors) ? errors : [errors] ;
        Error.captureStackTrace(this, this.constructor);
    }
    addError(error) {
        this.errors.push(error);
    }
    getErrors() {
        return this.errors;
    }
};
module.exports = CustomError; 
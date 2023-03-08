const ErrorHandler = require('../requestHandler');
class ErrorLogger extends ErrorHandler {
    constructor() {
        super()
    }
    get path() {
        return '/';
    }
    registerHandler(app) {
        app.use(this.path, (err, req, res, next) => {
            this.logger.logException(err);
            next(err);
        });
    }
}
module.exports = ErrorLogger;
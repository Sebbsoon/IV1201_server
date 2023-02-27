const ErrorHandler = require('./ErrorHandler');

class ErrorResponseSender extends ErrorHandler {

    constructor() {
        super();
    }
    get path() {
        return '/';
    }
    registerHandler(app) {
        app.use(this.path, (err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            }
            res.status(500).send({ error: 'Operation failed' });
        });
    }
} 
module.exports = ErrorResponseSender;
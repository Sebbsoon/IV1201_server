
const PersonApi = require('./PersonApi');
const ErrorLogger = require('./error/ErrorLogger');
const ErrorResponseSender = require('./error/ErrorResponseSender');

class RequestHandlerLoader {
    constructor() {
        this.reqHandlers = [];
        this.errorHandlers = [];
    }
    addRequestHandler(reqHandler) {
        this.reqHandlers.push(reqHandler);
    }
    addErrorHandler(errorHandler) {
        this.errorHandlers.push(errorHandler);
    }

    loadHandlers(app) {
        this.reqHandlers.forEach((reqHandler) => {
            reqHandler.registerHandler();
            app.use(reqHandler.path, reqHandler.router);
        });
    }


    loadErrorHandlers(app) {
        this.errorHandlers.forEach((errorHandler) => {
            errorHandler.registerHandler(app);
        });
    }

}
const loader = new RequestHandlerLoader();
loader.addRequestHandler(new PersonApi());
loader.addErrorHandler(new ErrorLogger());
loader.addErrorHandler(new ErrorResponseSender());
module.exports = loader;
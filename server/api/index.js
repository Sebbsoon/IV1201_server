
const PersonApi = require('./PersonApi');
const ApplicationApi = require('./ApplicationApi');
const ErrorLogger = require('./error/ErrorLogger');
const ErrorResponseSender = require('./error/ErrorResponseSender');
const ProtectedApi = require('./ProtectedApi');


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
loader.addRequestHandler(new ApplicationApi());
loader.addRequestHandler(new ProtectedApi());
loader.addErrorHandler(new ErrorLogger());
loader.addErrorHandler(new ErrorResponseSender());
module.exports = loader;
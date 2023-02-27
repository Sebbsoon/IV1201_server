const VError = require('verror').VError;
class Logger {
    logException(exc) {
        console.error(exc.message);
        console.error(exc.name);
        if (Object.values(VError.info(exc)).length !== 0) {
            console.error(VError.info(exc));
        }
        console.error(exc.message);
        const cause = VError.cause(exc);
        if (cause !== null) {
            console.error('Caused by: ');
            this.logException(cause);
        }
    }
}

module.exports = Logger;
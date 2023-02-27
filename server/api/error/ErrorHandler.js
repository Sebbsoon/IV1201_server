const Controller = require('../../controller/Controller');
const Logger = require('../../util/Logger');
class ErrorHandler {

    constructor() {
        this.logger = new Logger();
    }
    async retriveController() {
        this.contr = await Controller.createController();
    };
}
module.exports = ErrorHandler;
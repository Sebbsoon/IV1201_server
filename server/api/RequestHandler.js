const express = require('express');
const Controller = require('../controller/Controller');
const Logger = require('../util/Logger');

class RequestHandler {
    constructor() {
        this.router = express.Router();
        this.logger = new Logger();
    }
    static get URL_PREFIX() {
        return 'http://';
    }
    async retrieveController() {
        this.contr = await Controller.createController();
    }
    sendHttpResponse(res, status, body) {
        if (body === undefined) {
            res.status(status).end();
            return;
        }
        let errOrSucc = undefined;
        if (status < 400) {
            errOrSucc = 'success';
        } else {
            errOrSucc = 'error';
        }
        res.status(status).json({ [errOrSucc]: body });
    }
}
module.exports = RequestHandler;
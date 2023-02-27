const ProjectDAO = require('../integration/ProjectDAO');
class Controller {
    constructor() {
        this.projectDAO = new ProjectDAO();
        this.transactionMgr = this.projectDAO.getTransactionMgr();
    }
    static async createController() {
        const contr = new Controller();
        await contr.projectDAO.createTables();
        return contr;
    }
    loginPerson(username, password) {
        return this.transactionMgr.transaction(async (t1) => {
            return this.projectDAO.findPersonByLogin(username, password);
        })
    }
    findPerson(id) {
        return this.transactionMgr.transaction(async (t1) => {
            return this.projectDAO.findPersonById(id);
        })
    }
    createPerson(name, surname, pnr, email, password, role_id, username) {
        return this.transactionMgr.transaction(async (t1) => {
            return this.projectDAO.createPerson(name, surname, pnr, email, password, role_id, username);
        })
    }
    removePerson(id) {
        return this.transactionMgr.transaction(async (t1) => {
            return this.projectDAO.removePerson(id);
        })
    }
    findApplication(id) {
        return this.transactionMgr.transaction(async (t1) => {
            return this.projectDAO.findApplicationByPerson(id);
        })
    }
    createApplication(id, availability, competence) {
        return this.transactionMgr.transaction(async (t1) => {
            return await this.projectDAO.createApplication(id, availability, competence)
        })
    }
}
module.exports = Controller;
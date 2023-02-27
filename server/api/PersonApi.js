const RequestHandler = require('./RequestHandler');

class PersonApi extends RequestHandler {
	constructor() {
		super();
	}
	get path() {
		return PersonApi.PERSON_API_PATH;
	}
	static get PERSON_API_PATH() {
		return '/person';
	}
	async registerHandler() {
		try {
			await this.retrieveController();
			this.router.get('/:id', async (req, res, next) => {
				try {
					const person = await this.contr.findPerson(
						parseInt(req.params.id, 10)
					);

                        if (person === null) {
                            this.sendHttpResponse(res, 404, 'No such user');
                            return;
                        }
                        this.sendHttpResponse(res, 200, person);

                    } catch (err) {
                        next(err);
                    }
                }
            );
            this.router.post(
                '/login',
                async (req, res, next) => {
                    const username = req.body.username;
                    const password = req.body.password;
                    try {
                        const person = await this.contr.loginPerson(username, password);
                        if (person === null) {
                            this.sendHttpResponse(res, 401, 'Failed login');
                            return;
                        }
                        this.sendHttpResponse(res, 200, person);

                    } catch (err) {
                        next(err);
                    }
                }
            );
        }
        catch (err) {
            this.logger.logException(err);
        }
    }
}
module.exports = PersonApi;

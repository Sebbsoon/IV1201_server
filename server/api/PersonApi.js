const RequestHandler = require('./RequestHandler');
const jwt = require('jsonwebtoken');
const secretKey = "my_secret_key";
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
						const token = jwt.sign({ username }, secretKey);
						this.sendHttpResponse(res, 200, { person: person, token: token });

					} catch (err) {
						next(err);
					}
				}
			);
			this.router.post('/signup',
				async (req, res, next) => {
					console.log(req.body)
					const name = req.body.name;
					const surname = req.body.surname;
					const email = req.body.email;
					const password = req.body.password;
					const pnr = req.body.pnr;
					const username = req.body.username;

					try {
						const person = await this.contr.createPerson(name, surname, pnr, email, password, 2, username);
						if (person === null) {
							this.sendHttpResponse(res, 404, 'Failed to signup!');
						} else {
							const token = jwt.sign({ username }, secretKey);
							this.sendHttpResponse(res, 200, { person: person, token: token });
						}
					} catch (err) {
						next(err);
					}
				});
		}
		catch (err) {
			this.logger.logException(err);
		}
	}
}
module.exports = PersonApi;

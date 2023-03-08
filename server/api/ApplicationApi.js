const RequestHandler = require('./RequestHandler');

class ApplicationApi extends RequestHandler {
	constructor() {
		super();
	}
	get path() {
		return ApplicationApi.APPLICATION_API_PATH;
	}
	static get APPLICATION_API_PATH() {
		return '/application';
	}
	async registerHandler() {
		try {
			await this.retrieveController();
			this.router.post('/create', async (req, res, next) => {
				try {
					console.log(req.body);
					const personId = req.body.person_id;
					const availability = req.body.availability;
					const competence = req.body.competence;
					const application = await this.contr.createApplication(
						personId,
						availability,
						competence
					);
					if (application === false) {
						this.sendHttpResponse(res, 404, 'Failed to create application!');
					} else {
						this.sendHttpResponse(res, 200, application);
					}
				} catch (err) {
					next(err);
				}
			});
			this.router.get('/list', async (req, res, next) => {
				try {
					const list = await this.contr.findAllApplications();
					if (list === null) {
						this.sendHttpResponse(res, 404, 'Failed to create list!');
					} else {
						this.sendHttpResponse(res, 200, list);
					}
				} catch (err) {
					next(err);
				}
			});
		} catch (err) {
			this.logger.logException(err);
		}
	}
}
module.exports = ApplicationApi;

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
			/**
         * create a new application for the logged in user. 
         * @param personId : this parsmeter is the logged in user id for identifing the user.
         * @param availability : this parsmeter displays the periods the applicat can work.
         * @param competence : this parsmeter displays what competence the user have and how many years of experience they have.  
         * 
         * sends: 200 when the application is successfully created.
         *        400 when any error occurs when creating the application or entering unvalidated data by the user.  
         * returns: the created application. 
         * 
         * throws error if any error occurs when creating the application in the database. 
         */
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
				/**
             * list all applications. 
             * sends : 200 when having applications in database to send. 
             *         400 when there are no applications in the database. 
             * 
             * returns a list of all applications. 
             */
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

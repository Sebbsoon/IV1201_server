const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const Person = require('../model/Person');
const PersonDTO = require('../model/PersonDTO');
const ApplicationDTO = require('../model/ApplicationDTO');
const Availability = require('../model/Availability');
const AvailabilityDTO = require('../model/AvailabilityDTO');
const Competence = require('../model/Competence');
const CompetenceDTO = require('../model/CompetenceDTO');
const Validators = require('../util/Validators');
const Application = require('../model/Application');
const WError = require('verror').WError;

class ProjectDAO {
    constructor() {
        const namespace = cls.createNamespace('projectDB');
        Sequelize.useCLS(namespace);
        this.database = new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASS,
            {
                host: process.env.DB_HOST,
                dialect: process.env.DB_DIALECT,
                dialectOptions: {
                    ssl: {
                        rejectUnauthorized: false,
                    },
                },
            }
        );
        Person.createModel(this.database);
        Availability.createModel(this.database);
        Competence.createModel(this.database)
        Application.createModel(this.database);
    }
    getTransactionMgr() {
        return this.database;
    }
    async createTables() {
        try {
            await this.database.authenticate();
            await this.database.sync({ force: false });
        } catch (err) {
            console.log(new WError(
                {
                    cause: err,
                    info: { ProjectDAO: 'Failed to call authenticate and sync.' },
                },
                'Could not connect to database.',
            ))
        }
        return false

    }
    /**
     * Find one application in database by person_id
     * @param {*} id person_id for person
     * @returns ApplicationDTO object containging person, compatability, availability on success,
                returns false if unsuccessfull
     */
    async findApplicationByPerson(id) {
        if (!Validators.isValidId(id)) return false;
        try {
            const personModel = await Person.findOne({
                attributes: ['person_id', 'name', 'surname', 'email'],
                where: { person_id: id }
            })
            if (personModel === null) {
                console.log("person is null")
                return null;
            }
            const availabilityModel = await Availability.findAll({
                attributes: ['from_date', 'to_date'],
                where: { person_id: id }
            })
            if (availabilityModel === null) {
                console.log("availability is null")
                return null;
            }
            const competenceModel = await Competence.findAll({
                attributes: ['competence_id', 'years_of_experience'],
                where: { person_id: id }
            })
            if (competenceModel === null) {
                console.log("Competence is null")
                return null;
            }
            return this.createApplicationDto(personModel, availabilityModel, competenceModel)

        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to find application',
                        id: id
                    },
                },
                `Could not find application with id ${id}`
            ));
        } return false

    }
    /**
     * Find a person in the database by username and password
     * @param {*} username username for user
     * @param {*} password password for user
     * @returns return personDTO object on success,
                returns null if no person is found
                returns false if unsuccessfull
     */
    async findPersonByLogin(username, password,t) {
        try {
            const personModel = await Person.findOne({
                attributes: ['person_id', 'name', 'surname', 'pnr', 'email', 'password', 'role_id', 'username'],
                where: { username: username, password: password }
            });
            if (personModel === null) {
                return null;
            }
            return this.createPersonDto(personModel);
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to search for user by username and password.',
                        username: username,
                        password: password
                    },
                },
                `Could not find user with login credentials`,
            ));
        }
        return false
    }

    /**
     * find a person in database by person_id
     * @param {*} id the id for person 
     * @returns returns a personDTO object on success,
                returns null if no person is found
                returns false if unsuccessfull
     */
    async findPersonById(id) {
        if (!Validators.isValidId(id)) return false;
        try {
            const personModel = await Person.findOne({
                attributes: ['person_id', 'name', 'surname', 'pnr', 'email', 'password', 'role_id', 'username'],
                where: { person_id: id }
            });
            if (personModel === null) {
                return null;
            }
            return this.createPersonDto(personModel);
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to search for user by id.',
                        id: id,
                    },
                },
                `Could not search for user with id ${id}`,
            ));
        }
        return false;
    }
    /**
     * removes a person in database by person_id
     * @param {*} id id for person
     * @returns returns true on success
                returns false id is invalid
                returns null if person could not be destroyed
     */
    async removePerson(id) {
        if (!Validators.isValidId(id)) return false;

        try {
            const personModel = await Person.destroy({
                where: { person_id: id }
            })
            return true
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove person',
                        id: id,
                    },
                }, `Could not remove person with id ${id}`
            ));

        } return false


    }
    /**
     * find availability in database by person_id
     * @param {*} id id for person
     * @returns returns availabilityDTO object on success
                returns false if unsuccessfull
     */
    async findAvailability(id) {
        if (!Validators.isValidId(id)) return false;
        try {
            const availabilityModel = await Availability.findAll({
                where: { person_id: id }
            })
            return this.createAvailabilityDto(availabilityModel)
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to find availability',
                        id: id,
                    },
                }, `Could not find availability with id ${id}`
            ));
        } return false

    }
    /**
     * remove availability in database by person_id
     * @param {*} id id of person
     * @returns returns true if successfull
                returns false in unsuccessfull
     */
    async removeAvailability(id) {
        if (!Validators.isValidId(id)) return false;
        try {
            const availabilityModel = await Availability.destroy({
                where: { person_id: id }
            })
            return true
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove availability',
                        id: id,
                    },
                }, `Could not remove availability with id ${id}`
            ));
        } return false

    }
    /**
     * removes application by person_id
     * @param {*} id id of person
     * @returns returns true if successfull
                returns false if unsuccessfull
     */
    async removeApplicationStatus(id) {
        if (!Validators.isValidId(id)) return false;
        try {
            Application.destroy({
                where: { person_id: id }
            })
            return true
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove application',
                        id: id
                    },

                }, `Could not remove application with id ${id}`
            ));
        } return false

    }
    /**
     * removes competence from database by person_id
     * @param {*} id id of person
     * @returns returns true if successfull
                returns false if unsuccessfull
     */
    async removeCompetence(id) {
        if (!Validators.isValidId(id)) return false;

        try {
            await Competence.destroy({
                where: { person_id: id }
            })
            return true;
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove competence',
                        id: id
                    },
                }, `Could not remove competence with id ${id}`
            ));
        } return false

    }
    /**
     * finds all applications in database
     * @param {*} t database transaction 
     * @returns     returns list of applicationsDTOs on success
                    returns false if unsuccessfull
     */
    async findAllApplications(t) {
        try {
            const applicationList = [];
            const applications = await this.database.query("SELECT * FROM application", { type: Sequelize.QueryTypes.SELECT, transaction: t })
            await Promise.all(applications.map(async (app) => {
                const person_id = app.person_id;
                const person = (await this.database.query("SELECT * FROM person where person_id =" + person_id))
                const availability = await this.database.query("SELECT * FROM availability WHERE person_id = " + person_id, { transaction: t })
                const availabilityList = []
                availability[0].map(async (a) => {
                    availabilityList.push({ from_date: a.from_date, to_date: a.to_date })
                })
                const competence = await this.database.query("SELECT * FROM competence_profile WHERE person_id = " + person_id, { transaction: t })
                const competenceList = [
                    { competence_id: 1, years_of_experience: "0" },
                    { competence_id: 2, years_of_experience: "0" },
                    { competence_id: 3, years_of_experience: "0" }]
                competence[0].map((c) => {
                    competenceList[c.competence_id - 1].years_of_experience = c.years_of_experience
                })
                const status = { status: app.status }
                const application = this.createApplicationDto(person[0][0], availabilityList, competenceList, status)
                applicationList.push(application)
            }))
            return applicationList
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to find applications.'
                    },
                },
                `Could not find applications`,
            ));
        } return false

    }
    /**
     * creates new application and overwrites old application in database
     * @param {*} person_id id of person
     * @param {*} availability list of from_date and to_date
     * @param {*} competence list of competence and years_of_experience
     * @returns returns true if successfull
                returns false if unsuccessfull
     */
    async createApplication(person_id, availability, competence) {
        console.log("competence: "+competence)
        if (!Validators.isValidId(person_id)) return false;

        try {
            const person = await this.findPersonById(person_id);
            if (person === null) {
                return false;
            }
            await this.removeAvailability(person_id);
            await this.removeCompetence(person_id);
            await this.removeApplicationStatus(person_id);
            await Promise.all(
                availability.map(async (d) => {
                    await this.createAvailability(person_id, d.from_date, d.to_date)
                }),
                competence.map(async (c) => {
                    console.log(c)
                    await this.createCompetence(person_id, c.competence_id, c.years_of_experience)
                }),
                this.createApplicationStatus(person_id)
            )
            return true
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to create application.',
                        person_id: person_id,
                        availability: availability,
                        competence: competence
                    },
                },
                `Could not create application`,
            ));
        }
        return false

    }
    /**
     * creates new person in database
     * @param {*} name name of person
     * @param {*} surname surname of person
     * @param {*} pnr personal number of person
     * @param {*} email email of person
     * @param {*} password password of person
     * @param {*} role_id role id for person
     * @param {*} username username of person
     * @returns returns personDTO object on success
                returns false if unsuccessfull
     */
    async createPerson(name, surname, pnr, email, password, role_id, username) {
        try {
            const personModel = await Person.create({
                name: name,
                surname: surname,
                pnr: pnr,
                email: email,
                password: password,
                role_id: role_id,
                username: username
            })
            return this.createPersonDto(personModel);
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to create new person',
                        name: name,
                        surname: surname,
                        pnr: pnr,
                        email: email,
                        password: password,
                        role_id: role_id,
                        username: username
                    },
                },
                `Could not create new person`,
            ));
        }
        return false
    }
    /**
     * Create new availability in database
     * @param {*} person_id id of person
     * @param {*} from_date date for from_date
     * @param {*} to_date date for to_date
     * @returns returns an availabilityDTO on success
                returns 
     */
    async createAvailability(person_id, from_date, to_date) {
        try {
            const availabilityModel = await Availability.create({
                person_id: person_id,
                from_date: from_date,
                to_date: to_date,
            })
            return this.createAvailabilityDto(availabilityModel);
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to create new availability',
                        person_id: person_id,
                        from_date: from_date,
                        to_date: to_date,
                    },
                },
                `Could not create new availability`,
            ));
        }
        return false
    }
    /**
     * creates new competence in database
     * @param {*} person_id id of person
     * @param {*} competence_id id of competence
     * @param {*} years_of_experience years in decimals
     * @returns 
     */
    async createApplicationStatus(person_id) {
        try {
            const applicationModel = await Application.create(
                {
                    person_id: person_id,
                    status: 1
                }
            )
            return true
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to create application status',
                        person_id: person_id,
                        status: 1
                    }
                }
            ))
        }
        return false
    }
    async createCompetence(person_id, competence_id, years_of_experience) {
        try {
            const competenceModel = await Competence.create(
                {
                    person_id: person_id,
                    competence_id: competence_id,
                    years_of_experience: years_of_experience
                }
            )
            return this.createCompetenceDto(competenceModel);
        } catch (err) {
            throw(new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to create competence',
                        person_id: person_id,
                        competence_id: competence_id,
                        years_of_experience: years_of_experience
                    }
                }
            ))
        }
        return false

    }

    createCompetenceDto(competenceModel) {
        return new CompetenceDTO(
            competenceModel.person_id,
            competenceModel.competence_id,
            competenceModel.years_of_experience
        )
    }
    createAvailabilityDto(availabilityModel) {
        return new AvailabilityDTO(
            availabilityModel.availability_id,
            availabilityModel.person_id,
            availabilityModel.end_date,
            availabilityModel.to_date
        )
    }
    createPersonDto(personModel) {
        return new PersonDTO(
            personModel.person_id,
            personModel.name,
            personModel.surname,
            personModel.pnr,
            personModel.email,
            personModel.password,
            personModel.role_id,
            personModel.username)
    }
    createApplicationDto(personModel, availabilityModel, competenceModel, application_status) {
        const person = { person_id: personModel.person_id, name: personModel.name, surname: personModel.surname, email: personModel.email }
        const availability = availabilityModel.map((a) => { return { from_date: a.from_date, to_date: a.to_date } });
        const competence = (competenceModel.length != 0) ? competenceModel.map((c) => { return { competence_id: c.competence_id, years_of_experience: c.years_of_experience } }) : []
        const status = application_status.status;
        return new ApplicationDTO(person, availability, competence, status);
    }
}
module.exports = ProjectDAO;

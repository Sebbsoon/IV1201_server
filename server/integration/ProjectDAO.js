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
    }
    getTransactionMgr() {
        return this.database;
    }
    async createTables() {
        try {
            await this.database.authenticate();
            await this.database.sync({ force: false });
        } catch (err) {
            throw new WError(
                {
                    cause: err,
                    info: { ProjectDAO: 'Failed to call authenticate and sync.' },
                },
                'Could not connect to database.',
            );
        }
    }
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
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to find application',
                        id: id
                    },
                },
                `Could not find application with id ${id}`
            );
        }
    }
    async findPersonByLogin(username, password) {
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
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'Failed to search for user by username and password.',
                        username: username,
                        password: password
                    },
                },
                `Could not find user with login credentials`,
            );
        }
    }

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
            console.log(new WError(
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
    async removePerson(id) {
        if (!Validators.isValidId(id)) return false;

        try {
            const personModel = await Person.destroy({
                where: { person_id: id }
            })
            return this.createPersonDto(personModel)
        } catch (err) {
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove person',
                        id: id,
                    },
                }, `Could not remove person with id ${id}`
            );

        }
    } async removeAvailability(id) {
        if (!Validators.isValidId(id)) return false;

        try {
            const availabilityModel = await Availability.destroy({
                where: { person_id: id }
            })
            return this.createAvailabilityDto(availabilityModel)
        } catch (err) {
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove availability',
                        id: id,
                    },
                }, `Could not remove availability with id ${id}`
            );
        }
    } async removeCompetence(id) {
        if (!Validators.isValidId(id)) return false;

        try {
            await Competence.destroy({
                where: { person_id: id }
            })
        } catch (err) {
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to remove competence',
                        id: id
                    },
                }, `Could not remove competence with id ${id}`
            )

        }
    }

    async createApplication(person_id, availability, competence) {
        if (!Validators.isValidId(person_id)) return false;

        try {
            const person = await this.findPersonById(person_id);
            if (person !== null) {
                return false;
            }
            const oldAvailability = await this.removeAvailability(person_id);
            await this.removeCompetence(person_id);
            await Promise.all(
                availability.dates.map(async (d) => {
                    await this.createAvailability(person_id, d.from_date, d.to_date)
                }),
                competence.competence.map(async (c) => {
                    await this.createCompetence(person_id, c.competence_id, c.years_of_experience)
                })
            )
            return true
        } catch (err) {
            throw new WError(
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
            );
        }
    } async createPerson(name, surname, pnr, email, password, role_id, username) {
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
            throw new WError(
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
            );
        }
    }
    async createAvailability(person_id, from_date, to_date) {
        try {
            const availabilityModel = await Availability.create({
                person_id: person_id,
                from_date: from_date,
                to_date: to_date,
            })
            return this.createAvailabilityDto(availabilityModel);
        } catch (err) {
            throw new WError(
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
            );
        }
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
            throw new WError(
                {
                    cause: err,
                    info: {
                        ProjectDAO: 'failed to create competence',
                        person_id: person_id,
                        competence_id: competence_id,
                        years_of_experience: years_of_experience
                    }
                }
            )
        }
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
    createApplicationDto(personModel, availabilityModel, competenceModel) {
        const person = { person_id: personModel.person_id, name: personModel.name, surname: personModel.surname, email: personModel.email }
        const availability = availabilityModel.map((a) => { return { from_date: a.from_date, to_date: a.to_date } });
        const competence = competenceModel.map((c) => { return { competence_id: c.competence_id, years_of_experience: c.years_of_experience } })
        return new ApplicationDTO(person, availability, competence,
        );
    }
}
module.exports = ProjectDAO;

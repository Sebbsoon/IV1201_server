const Sequelize = require('sequelize');

class Person extends Sequelize.Model {
    static get PERSON_MODEL_NAME() {
        return 'person';
    }
    static createModel(sequelize) {
        Person.init(
            {
                person_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                surname: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                pnr: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                email: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                password: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                role_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                username: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
            },
            { sequelize, modelName: Person.PERSON_MODEL_NAME, tableName: Person.PERSON_MODEL_NAME, timestamps: false }
        );
        return Person;
    }
}
module.exports = Person;
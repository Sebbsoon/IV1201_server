const Sequelize = require("sequelize")

class Application extends Sequelize.Model {
    static get APPLICATION_MODEL_NAME() {
        return 'application'
    }
    static createModel(sequelize) {
        Application.init(
            {
                application_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                person_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                status: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
               
            },
            { sequelize, modelName: Application.APPLICATION_MODEL_NAME, tableName: 'application', timestamps: false }
        );
        return Application;
    }
}
module.exports = Application
const Sequelize = require("sequelize")

class Competence extends Sequelize.Model {
    static get COMPETENCE_MODEL_NAME() {
        return 'competence'
    }
    static createModel(sequelize) {
        Competence.init(
            {
                competence_profile_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                person_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                competence_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                years_of_experience: {
                    type: Sequelize.DECIMAL(4, 2),
                    allowNull: true,
                },
            },
            { sequelize, modelName: Competence.COMPETENCE_MODEL_NAME, tableName: 'competence_profile', timestamps: false }
        );
        return Competence;
    }
}
module.exports = Competence
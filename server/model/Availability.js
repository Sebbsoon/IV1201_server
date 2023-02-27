const Sequelize = require('sequelize');

class Availability extends Sequelize.Model {
    static get AVAILABILITY_MODEL_NAME() {
        return 'availability';
    }
    static createModel(sequelize) {
        Availability.init(
            {
                availability_id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                person_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                from_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                to_date: {
                    type: Sequelize.DATE,
                    allowNull: false,
                }
            },
            { sequelize, modelName: Availability.AVAILABILITY_MODEL_NAME, tableName: Availability.AVAILABILITY_MODEL_NAME, timestamps: false }
        );
        return Availability;
    }
}
module.exports = Availability;
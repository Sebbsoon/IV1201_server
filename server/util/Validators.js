class Validators {
    static isValidId(id) {
        if (!Number.isInteger(id)) {
            console.log("Validation error: ID is not an integer")
            return false;
        }
        if (id < 0) {
            console.log("Validation error: ID is not an positive integer")
            return false;
        }
        return true;
    }
} module.exports = Validators;
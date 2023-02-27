class Validators {
    static isValidId(id) {
        if (!Number.isInteger(id)) return false;
        if (id < 0) return false;
        return true;
    }
}module.exports= Validators;
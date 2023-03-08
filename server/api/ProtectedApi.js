const RequestHandler = require("./RequestHandler");
const jwt = require('jsonwebtoken');
const secretKey = "my_secret_key";


class ProtectedApi extends RequestHandler {
    constructor() {
        super()
    }
    get path() {
        return ProtectedApi.PROTECTED_API_PATH;
    }
    static get PROTECTED_API_PATH() {
        return '/protected';
    }
    async registerHandler() {

        await this.retrieveController();
        try {
            this.router.get(
                "/",
                (req, res, next) => {
                    // Get the JWT from the Authorization header
                    const authHeader = req.headers.authorization;
                    const token = authHeader ? authHeader.split(' ')[1] : null;

                    // Verify the JWT and extract the username
                    try {
                        const decoded = jwt.verify(token, secretKey);
                        // Send a response with a message that includes the username
                        this.sendHttpResponse(res,200,"Valid token")
                    } catch (err) {
                        next(err);
                    }
                }
            );

        } catch (error) {

        }
    }
}
module.exports = ProtectedApi;
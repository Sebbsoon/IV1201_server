const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

const result = require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env.example'),
});

const express = require('express');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await controller.findUserByUsernameAndPassword(
        username,
        password
    );

    if (result) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

module.exports = router;

const app = express();

const cors = require('cors');
app.use(cors());

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.static(path.join(APP_ROOT_DIR, "..", 'public')));

const reqHandlerLoader = require('./api');
reqHandlerLoader.loadHandlers(app);
reqHandlerLoader.loadErrorHandlers(app);


app.get("/", (req, res) => {
    return res.send('this is root')
});

const server = app.listen(8000,
    () => {
        console.log(`Server on port ${server.address().address}:${server.address().port}`);
    }
);

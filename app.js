/***************************************
 * Main App
 * @file: app.js
 * @author: Ounje360 Inc (James Abiagam)
 ****************************************/
"use strict";

require("dotenv").config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const MySQLStore = require('express-mysql-session')(session);
let PORT = process.env.PORT;
let SERVER = process.env.HOST;
const moment = require('moment-timezone');
const formidableMiddleware = require('express-formidable');
const winston = require('winston');
const os = require('os');
const { Logtail }  = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
const logtail = new Logtail(process.env.BETTER_STACK_TOKEN);
const webRoutes = require('./routes/index');


os.tmpDir = os.tmpdir;
const sourcePath = path.resolve(__dirname, "public/assets/doc-cloud");


const app = express();
const { combine, timestamp, json } = winston.format;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.options("*", cors());
app.use(formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: sourcePath,
    multiples: false, // req.files to be arrays of files
}));

const CREDENTIALS = {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT
};
const sessionStore =  new MySQLStore(CREDENTIALS); // Change the express session store
const sessionConfig = {
    secret: process.env.SECRET,
    key:'ges_user',
    resave: true,
    saveUninitialized: true, //recommended: only save session when data exists
    cookie: {
        httpOnly: false,
        secure: false, maxAge: 24 * 60 * 60 * 1000 ,  expires: 1000 * 60 * 60 * 24 * 3,
        name: 'ges_partner',
    }, // 24 Hours
    store: sessionStore
};
app.use(session(sessionConfig));
// Optionally use onReady() to get a promise that resolves when store is ready.
sessionStore.onReady().then(() => {
    // MySQL session store ready for use.
    console.log('MySQLStore ready to store sessions');
}).catch(error => {
    // Something went wrong.
    console.error(error);
});
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionConfig.secure = true; // serve secure cookies
}

const logger = winston.createLogger({
    level: 'http',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
    ),
    transports: [new winston.transports.Console(), new LogtailTransport(logtail)]
});

/*const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => logger.http(message.trim()),
        },
    }
);*/
const morganMiddleware = morgan(
    function (tokens, req, res) {
        return JSON.stringify({
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number.parseFloat(tokens.status(req, res)),
         //   content_length: tokens.res(req, res, 'content-length'),
            response_time: Number.parseFloat(tokens['response-time'](req, res)),
        });
    },
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => {
                const data = JSON.parse(message);
                logger.http(`incoming-request`, data);
            },
        },
    }
);
app.use(morganMiddleware);


global.logSentry = logger;

app.use(function(req, res, next) {
    if('session' in req) {
        ('ges_user' in req.session) ? global.gesUser = req.session.ges_user : '';
        ('partnerId' in req.session) ? global.partnerId = req.session.partnerId : '';
        ('profile' in req.session) ? global.profile = req.session.profile : '';
        ('firstname' in req.session) ? global.firstname = req.session.firstname : '';
        ('lastname' in req.session) ? global.lastname = req.session.lastname : '';
        ('user_id' in req.session) ? global.userId = req.session.user_id : '';
        ('role' in req.session) ? global.role = req.session.role : '';
        ('last_login' in req.session) ? global.lastLogin = req.session.last_login : Number(0);
    }
   // global.helpers = ejs_helpers;
    global.active = 'dashboard';
    next();
});
app.use(flash());
app.use(webRoutes);
logtail.flush();
app.listen(PORT, () => {
    let localTime = moment().tz("Africa/Lagos").format("MMM D, YYYY h:mma z");
    console.info(
        `GES Partner Portal running on ${SERVER}:${PORT} on ${localTime} `
    );
});

module.exports = app;

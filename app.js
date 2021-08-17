const { react_server, secret } = require('./utils/config');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongodbConnection = require('./utils/db.config');
const passport = require('passport');
const { json, urlencoded } = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
    cors({
        origin: react_server,
        credentials: true,
    })
);

app.use(
    session({
        secret: secret,
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false },
        store: MongoStore.create(mongodbConnection),
    })
);

app.use(cookieParser(secret));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport/localStrategy');
require('./middleware/sanitizeBody');

//static
app.use('/api/file', express.static(path.join(__dirname, 'fileupload')));

//routes
app.use('/api', require('./routes/dashboardRoutes'));
app.use('/register', require('./routes/registerRoutes'));
app.use('/login', require('./routes/loginRoutes'));
app.use('/api/applicant', require('./routes/applicantRoutes'));
app.use('/api/add', require('./routes/addRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));
app.use('/api/jobpost', require('./routes/jobpostRoutes'));
app.use('/api/inbox', require('./routes/inboxRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/timeoff', require('./routes/timeoffRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));

app.listen(3001, async (err) => {
    if (err) throw err;
});

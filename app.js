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
const Interview = require('./models/interviews');
const moment = require('moment');

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
// app.use(require('./middleware/sanitizeBody'));

//routes
app.use('/api', require('./routes/dashboardRoutes'));
app.use('/register', require('./routes/registerRoutes'));
app.use('/login', require('./routes/loginRoutes'));

app.listen(3001, async (err) => {
	if (err) throw err;
	const user = await Interview.find({});
	if (user.length === 0) {
		const interview = new Interview({
			userId: '60f1d4e0429ab43a547d8a80',
			interviewee: '60f1d510429ab43a547d8a84',
			assignBy: '60f1d4f9429ab43a547d8a82',
			date_time: moment().add(3, 'days'),
		});
		await interview.save();
	}
});

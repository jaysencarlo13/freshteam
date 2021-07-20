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
const Applicant = require('./models/applicant');
const Users = require('./models/user');
const Organizations = require('./models/organization');
const Organization_Members = require('./models/organization_members');
const JobPostings = require('./models/job_postings');

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

//routes
app.use('/api', require('./routes/dashboardRoutes'));
app.use('/register', require('./routes/registerRoutes'));
app.use('/login', require('./routes/loginRoutes'));
app.use('/api/add', require('./routes/addRoutes'));

app.listen(3001, async (err) => {
	if (err) throw err;
	const interviews = await Interview.find({});
	if (interviews.length === 0) {
		const interview = new Interview({
			interviewer: '60f1d510429ab43a547d8a80',
			interviewee: '60f1d510429ab43a547d8a90',
			assignBy: '60f1d510429ab43a547d8a81',
			date_time: moment().add(3, 'days'),
		});
		await interview.save();
	}
	const applicant = await Applicant.find({});
	if (applicant.length === 0) {
		const newApplicant = new Applicant({
			_id: '60f1d510429ab43a547d8a90',
			personal_info: {
				name: 'Applicant Name',
				email: 'applicant@applicant.com',
				birthdate: moment().subtract(27, 'years'),
				home: 'Applicants Home',
				contact: '11111111111',
			},
			job_applications: [
				{
					applied_job: '60f1d510429ab43a547d8a70',
					date_applied: moment().subtract(27, 'days'),
					status: 'Validation',
					referred_by: '60f1d510429ab43a547d8a80',
				},
			],
		});
		newApplicant.save();
	}
	const users = await Users.find({});
	if (users.length === 0) {
		let newUser = new Users({
			_id: '60f1d510429ab43a547d8a80',
			name: 'Jaysen Carlo Magno',
			email: 'jaysencarlo13@gmail.com',
			password: 'jaysen1234',
			birthdate: moment('07-30-1996', 'MM-DD-YYYY'),
			contact: '09650470370',
			home: 'Cabuyao Laguna Phil.',
			work_info: {
				organization_id: '60f1d510429ab43a547d8a79',
				employee_id: 'E202105261',
				department: 'Software',
				title: 'Manager',
				join_date: moment('05-26-2021', 'MM-DD-YYYY'),
			},
		});
		await newUser.save();
		newUser = new Users({
			_id: '60f1d510429ab43a547d8a81',
			name: 'Carlo Magno',
			email: 'jaysencarlo14@gmail.com',
			password: 'jaysen1234',
			birthdate: moment('07-25-1996', 'MM-DD-YYYY'),
			contact: '09650470370',
			home: 'Cabuyao Laguna Phil.',
			work_info: {
				organization_id: '60f1d510429ab43a547d8a79',
				employee_id: 'E201505261',
				department: 'HR',
				title: 'Recruiter',
				join_date: moment('05-26-2015', 'MM-DD-YYYY'),
			},
		});
		await newUser.save();
		newUser = new Users({
			_id: '60f1d510429ab43a547d8a82',
			name: 'Jaysen Magno',
			email: 'jaysencarlo15@gmail.com',
			password: 'jaysen1234',
			birthdate: moment('07-20-1996', 'MM-DD-YYYY'),
			contact: '09650470370',
			home: 'Cabuyao Laguna Phil.',
			work_info: {
				organization_id: '60f1d510429ab43a547d8a79',
				employee_id: 'E202107181',
				department: 'Software',
				title: 'Junior Developer',
				join_date: moment('07-18-2021', 'MM-DD-YYYY'),
			},
		});
		await newUser.save();
	}
	const organizations = await Organizations.find({});
	if (organizations.length === 0) {
		const organization = new Organizations({
			_id: '60f1d510429ab43a547d8a79',
			created_by: '60f1d510429ab43a547d8a80',
			name: 'Streamline Corporation',
			description:
				'Streamline helps organize business processes by enabling the development of a personal connection and a lasting relationship with customers, partners, and other elements of the chain such as the suppliers and investors. We offer a modern tool for communication empowering businesses to connect with their employees and customers wherever they are, using their existing phone lines that have been upgraded into a smart one in order to convey the right message at the right time to the right people.',
			headquarters: 'New York, NY ',
			industry: 'Software Industry',
		});
		await organization.save();
	}
	const organization_members = await Organization_Members.find({});
	if (organization_members.length === 0) {
		let organization_member = new Organization_Members({
			member_id: '60f1d510429ab43a547d8a80',
			organization_id: '60f1d510429ab43a547d8a79',
		});
		await organization_member.save();
		organization_member = new Organization_Members({
			member_id: '60f1d510429ab43a547d8a81',
			organization_id: '60f1d510429ab43a547d8a79',
		});
		await organization_member.save();
		organization_member = new Organization_Members({
			member_id: '60f1d510429ab43a547d8a82',
			organization_id: '60f1d510429ab43a547d8a79',
		});
		await organization_member.save();
	}
	const jobpostings = await JobPostings.find({});
	if (jobpostings.length === 0) {
		let jobposting = new JobPostings({
			_id: '60f1d510429ab43a547d8a70',
			organization_id: '60f1d510429ab43a547d8a79',
			created_by: '60f1d510429ab43a547d8a80',
			title: 'Junior Software Developer',
			job_description:
				'StreamLine Corp. is looking for Junior Software Developer to join our software development team. In this role, you collaborate with other developers and engineers to design communication-related computer applications and programs. Part of these responsibilities include writing and debugging code, so we are looking for applicants familiar with Java, JavaScript, HTML, CSS, and other common programming languages. You should also be comfortable using .Net, AngularJS, and other common frameworks to develop software for various platforms.',
		});
		await jobposting.save();
	}
});

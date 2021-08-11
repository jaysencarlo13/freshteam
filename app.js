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
const Candidates = require('./models/candidates');
const Talentpool = require('./models/talent_pool');
const Inbox = require('./models/inbox');

const minify = require('html-minifier').minify;

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
app.use('/api/applicant', require('./routes/applicantRoutes'));
app.use('/api/add', require('./routes/addRoutes'));
app.use('/api/recruitment', require('./routes/recruitmentRoutes'));
app.use('/api/jobpost', require('./routes/jobpostRoutes'));
app.use('/api/inbox', require('./routes/inboxRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/timeoff', require('./routes/timeoffRoutes'));

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
        let newApplicant = new Applicant({
            _id: '60f1d510429ab43a547d8a90',
            personal_info: {
                name: 'Applicant Name',
                email: 'applicant@applicant.com',
                birthdate: moment().subtract(27, 'years'),
                home: 'Applicants Home',
                contact: '11111111111',
            },
            password: 'jaysen1234',
        });
        await newApplicant.save();
        newApplicant = new Applicant({
            _id: '60f1d510429ab43a547d8a91',
            personal_info: {
                name: 'Liam Olivia',
                email: 'liam@applicant.com',
                birthdate: moment().subtract(27, 'years'),
                home: 'Applicants Home',
                contact: '22222222222',
            },
            password: 'jaysen1234',
        });
        await newApplicant.save();
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
            employee_id: 'E0001',
            department: 'Software',
            title: 'Owner',
            join_date: moment().subtract(2, 'years'),
        });
        await organization_member.save();
        organization_member = new Organization_Members({
            member_id: '60f1d510429ab43a547d8a81',
            organization_id: '60f1d510429ab43a547d8a79',
            employee_id: 'E0002',
            department: 'HR',
            title: 'Manager',
            join_date: moment().subtract(1, 'year'),
        });
        await organization_member.save();
        organization_member = new Organization_Members({
            member_id: '60f1d510429ab43a547d8a82',
            organization_id: '60f1d510429ab43a547d8a79',
            employee_id: 'E0003',
            department: 'Software',
            title: 'Junior Developer',
            join_date: moment().subtract(2, 'months'),
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
            range: 'PHP 20000 - PHP 30000',
            type: 'Regular or Permanent',
            editor: JSON.stringify({
                blocks: [
                    {
                        key: 'cmohe',
                        text: "Cambridge is searching for a full-time Junior Software Quality Analyst to join our Schools Technology group, and help us develop and execute software for both manual and automated tests. The successful candidate will help us create best-in-class websites and platforms – such as Cambridge Go and Cambridge Elevate – used by primary and secondary level students all over the world.\nWhy should you join Cambridge?\nCambridge University Press and Assessment is a global company working under the umbrella of the University of Cambridge in the United Kingdom. The Philippine hub is located in Makati City, with more than 600 associates supporting the University's global publishing and assessment operations.\nWhen you join Cambridge, you get the best possible start in the best possible career in IT, and with benefits to match. As a global institution, our mission is to unlock our people's potential by providing all the knowledge and tools essential for your role and creating an environment that will enable you to perform at your peak.\nWhat can we offer you?\nWe have 50 offices worldwide, with ten major ‘hubs.' In this role, you will work and collaborate with colleagues from our UK headquarters and hubs in New York, Singapore, Australia, India, etc. It is an opportunity that will enable you to widen your horizon by learning from other cultures.\nIf you are a new graduate of an IT, Software, or QA-related degree, we strongly encourage you to apply for this position. You can become a highly proficient quality analyst as you work with a team led by seasoned leads and senior analysts. In addition, you will also be given essential skills training and certification like the ISTQB (Foundation Level).\nOn top of these opportunities, working with Cambridge will also give you stability. We show our care for our people by allowing them to grow not just professionally but also personally. We promote work-life balance through flexible work schedules, hybrid work arrangements, and generous paid leaves. In addition, you will be entitled to our health care benefits (HMO), group life insurance, and robust wellness programs right on the first day of joining the company.\nWhat will you do as a Junior Quality Analyst?\nYour tasks will primarily be to test plans, data, procedures, and manual and/or automated scripts. With close supervision from your team lead and senior analysts, you will also participate in reviews of business requirements and application designs, and support proper test coverage exists.\nYour role will also involve working with various stakeholders, including developers, business product owners and project managers, and scrum masters to help develop the overall test plan of a given project.\nThe Education Technology team will soon be called Schools Technology, the group that supports global teachers and students in their learning and teaching experiences\nWhat qualifications are we looking for?\nWe are looking for candidates with 1-2 years of software testing experience gained across one of the principle testing specialism (i.e., manual, automated, performance etc).\nIn addition, understanding, knowledge or expertise in the following are an advantage:",
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 380, style: 'color-rgb(45,45,45)' },
                            { offset: 381, length: 30, style: 'color-rgb(45,45,45)' },
                            { offset: 412, length: 291, style: 'color-rgb(45,45,45)' },
                            { offset: 704, length: 331, style: 'color-rgb(45,45,45)' },
                            { offset: 1036, length: 22, style: 'color-rgb(45,45,45)' },
                            { offset: 1059, length: 290, style: 'color-rgb(45,45,45)' },
                            { offset: 1350, length: 354, style: 'color-rgb(45,45,45)' },
                            { offset: 1705, length: 466, style: 'color-rgb(45,45,45)' },
                            { offset: 2172, length: 45, style: 'color-rgb(45,45,45)' },
                            { offset: 2218, length: 290, style: 'color-rgb(45,45,45)' },
                            { offset: 2509, length: 206, style: 'color-rgb(45,45,45)' },
                            { offset: 2716, length: 165, style: 'color-rgb(45,45,45)' },
                            { offset: 2882, length: 39, style: 'color-rgb(45,45,45)' },
                            { offset: 2922, length: 173, style: 'color-rgb(45,45,45)' },
                            { offset: 3096, length: 85, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 380, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 381, length: 30, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 412, length: 291, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 704, length: 331, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1036, length: 22, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1059, length: 290, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1350, length: 354, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1705, length: 466, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2172, length: 45, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2218, length: 290, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2509, length: 206, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2716, length: 165, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2882, length: 39, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2922, length: 173, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 3096, length: 85, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 380, style: 'fontsize-13.3328' },
                            { offset: 381, length: 30, style: 'fontsize-13.3328' },
                            { offset: 412, length: 291, style: 'fontsize-13.3328' },
                            { offset: 704, length: 331, style: 'fontsize-13.3328' },
                            { offset: 1036, length: 22, style: 'fontsize-13.3328' },
                            { offset: 1059, length: 290, style: 'fontsize-13.3328' },
                            { offset: 1350, length: 354, style: 'fontsize-13.3328' },
                            { offset: 1705, length: 466, style: 'fontsize-13.3328' },
                            { offset: 2172, length: 45, style: 'fontsize-13.3328' },
                            { offset: 2218, length: 290, style: 'fontsize-13.3328' },
                            { offset: 2509, length: 206, style: 'fontsize-13.3328' },
                            { offset: 2716, length: 165, style: 'fontsize-13.3328' },
                            { offset: 2882, length: 39, style: 'fontsize-13.3328' },
                            { offset: 2922, length: 173, style: 'fontsize-13.3328' },
                            { offset: 3096, length: 85, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 380,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 381,
                                length: 30,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 412,
                                length: 291,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 704,
                                length: 331,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1036,
                                length: 22,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1059,
                                length: 290,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1350,
                                length: 354,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1705,
                                length: 466,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2172,
                                length: 45,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2218,
                                length: 290,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2509,
                                length: 206,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2716,
                                length: 165,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2882,
                                length: 39,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2922,
                                length: 173,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 3096,
                                length: 85,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                    {
                        key: 'vr59',
                        text: 'Software development process including analysis and design, coding, system and user testing, problem resolution',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 111, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 111, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 111, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 111,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: 'c4i65',
                        text: 'Agile development process (Scrum or similar)',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 44, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 44, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 44, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 44,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: '92m9o',
                        text: 'An ideal candidate for this role also possesses the essential skills to become a future team leader and decision-maker, including communication skills and working with peers in different time zones.',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 198, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 198, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 198, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 198,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                    {
                        key: '52pi6',
                        text: 'Job Type: Permanent ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 19, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 19, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 19, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 19,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                ],
                entityMap: {},
            }),
        });
        await jobposting.save();
        jobposting = new JobPostings({
            _id: '60f1d510429ab43a547d8a71',
            organization_id: '60f1d510429ab43a547d8a79',
            created_by: '60f1d510429ab43a547d8a80',
            title: 'Senior Developer',
            range: 'PHP 30000 - PHP 40000',
            type: 'Regular or Permanent',
            editor: JSON.stringify({
                blocks: [
                    {
                        key: 'cmohe',
                        text: "Cambridge is searching for a full-time Junior Software Quality Analyst to join our Schools Technology group, and help us develop and execute software for both manual and automated tests. The successful candidate will help us create best-in-class websites and platforms – such as Cambridge Go and Cambridge Elevate – used by primary and secondary level students all over the world.\nWhy should you join Cambridge?\nCambridge University Press and Assessment is a global company working under the umbrella of the University of Cambridge in the United Kingdom. The Philippine hub is located in Makati City, with more than 600 associates supporting the University's global publishing and assessment operations.\nWhen you join Cambridge, you get the best possible start in the best possible career in IT, and with benefits to match. As a global institution, our mission is to unlock our people's potential by providing all the knowledge and tools essential for your role and creating an environment that will enable you to perform at your peak.\nWhat can we offer you?\nWe have 50 offices worldwide, with ten major ‘hubs.' In this role, you will work and collaborate with colleagues from our UK headquarters and hubs in New York, Singapore, Australia, India, etc. It is an opportunity that will enable you to widen your horizon by learning from other cultures.\nIf you are a new graduate of an IT, Software, or QA-related degree, we strongly encourage you to apply for this position. You can become a highly proficient quality analyst as you work with a team led by seasoned leads and senior analysts. In addition, you will also be given essential skills training and certification like the ISTQB (Foundation Level).\nOn top of these opportunities, working with Cambridge will also give you stability. We show our care for our people by allowing them to grow not just professionally but also personally. We promote work-life balance through flexible work schedules, hybrid work arrangements, and generous paid leaves. In addition, you will be entitled to our health care benefits (HMO), group life insurance, and robust wellness programs right on the first day of joining the company.\nWhat will you do as a Junior Quality Analyst?\nYour tasks will primarily be to test plans, data, procedures, and manual and/or automated scripts. With close supervision from your team lead and senior analysts, you will also participate in reviews of business requirements and application designs, and support proper test coverage exists.\nYour role will also involve working with various stakeholders, including developers, business product owners and project managers, and scrum masters to help develop the overall test plan of a given project.\nThe Education Technology team will soon be called Schools Technology, the group that supports global teachers and students in their learning and teaching experiences\nWhat qualifications are we looking for?\nWe are looking for candidates with 1-2 years of software testing experience gained across one of the principle testing specialism (i.e., manual, automated, performance etc).\nIn addition, understanding, knowledge or expertise in the following are an advantage:",
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 380, style: 'color-rgb(45,45,45)' },
                            { offset: 381, length: 30, style: 'color-rgb(45,45,45)' },
                            { offset: 412, length: 291, style: 'color-rgb(45,45,45)' },
                            { offset: 704, length: 331, style: 'color-rgb(45,45,45)' },
                            { offset: 1036, length: 22, style: 'color-rgb(45,45,45)' },
                            { offset: 1059, length: 290, style: 'color-rgb(45,45,45)' },
                            { offset: 1350, length: 354, style: 'color-rgb(45,45,45)' },
                            { offset: 1705, length: 466, style: 'color-rgb(45,45,45)' },
                            { offset: 2172, length: 45, style: 'color-rgb(45,45,45)' },
                            { offset: 2218, length: 290, style: 'color-rgb(45,45,45)' },
                            { offset: 2509, length: 206, style: 'color-rgb(45,45,45)' },
                            { offset: 2716, length: 165, style: 'color-rgb(45,45,45)' },
                            { offset: 2882, length: 39, style: 'color-rgb(45,45,45)' },
                            { offset: 2922, length: 173, style: 'color-rgb(45,45,45)' },
                            { offset: 3096, length: 85, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 380, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 381, length: 30, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 412, length: 291, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 704, length: 331, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1036, length: 22, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1059, length: 290, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1350, length: 354, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 1705, length: 466, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2172, length: 45, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2218, length: 290, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2509, length: 206, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2716, length: 165, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2882, length: 39, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 2922, length: 173, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 3096, length: 85, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 380, style: 'fontsize-13.3328' },
                            { offset: 381, length: 30, style: 'fontsize-13.3328' },
                            { offset: 412, length: 291, style: 'fontsize-13.3328' },
                            { offset: 704, length: 331, style: 'fontsize-13.3328' },
                            { offset: 1036, length: 22, style: 'fontsize-13.3328' },
                            { offset: 1059, length: 290, style: 'fontsize-13.3328' },
                            { offset: 1350, length: 354, style: 'fontsize-13.3328' },
                            { offset: 1705, length: 466, style: 'fontsize-13.3328' },
                            { offset: 2172, length: 45, style: 'fontsize-13.3328' },
                            { offset: 2218, length: 290, style: 'fontsize-13.3328' },
                            { offset: 2509, length: 206, style: 'fontsize-13.3328' },
                            { offset: 2716, length: 165, style: 'fontsize-13.3328' },
                            { offset: 2882, length: 39, style: 'fontsize-13.3328' },
                            { offset: 2922, length: 173, style: 'fontsize-13.3328' },
                            { offset: 3096, length: 85, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 380,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 381,
                                length: 30,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 412,
                                length: 291,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 704,
                                length: 331,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1036,
                                length: 22,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1059,
                                length: 290,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1350,
                                length: 354,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 1705,
                                length: 466,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2172,
                                length: 45,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2218,
                                length: 290,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2509,
                                length: 206,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2716,
                                length: 165,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2882,
                                length: 39,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 2922,
                                length: 173,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                            {
                                offset: 3096,
                                length: 85,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                    {
                        key: 'vr59',
                        text: 'Software development process including analysis and design, coding, system and user testing, problem resolution',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 111, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 111, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 111, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 111,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: 'c4i65',
                        text: 'Agile development process (Scrum or similar)',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 44, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 44, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 44, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 44,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: '92m9o',
                        text: 'An ideal candidate for this role also possesses the essential skills to become a future team leader and decision-maker, including communication skills and working with peers in different time zones.',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 198, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 198, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 198, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 198,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                    {
                        key: '52pi6',
                        text: 'Job Type: Permanent ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [
                            { offset: 0, length: 19, style: 'color-rgb(45,45,45)' },
                            { offset: 0, length: 19, style: 'bgcolor-rgb(255,255,255)' },
                            { offset: 0, length: 19, style: 'fontsize-13.3328' },
                            {
                                offset: 0,
                                length: 19,
                                style: 'fontfamily-Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
                            },
                        ],
                        entityRanges: [],
                        data: { 'text-align': 'start' },
                    },
                ],
                entityMap: {},
            }),
        });
        await jobposting.save();
    }
    const candidates = await Candidates.find({});
    if (candidates.length === 0) {
        const newCandidate = new Candidates({
            job_posting_id: '60f1d510429ab43a547d8a70',
            applicant_id: '60f1d510429ab43a547d8a91',
            date_applied: moment().subtract(5, 'days').toDate(),
            status: 'Exam',
            referred_by: '60f1d510429ab43a547d8a80',
        });
        await newCandidate.save();
    }
    const talentpool = await Talentpool.find({});
    if (talentpool.length === 0) {
        const newTalent = new Talentpool({
            job_posting_id: '60f1d510429ab43a547d8a70',
            applicant_id: '60f1d510429ab43a547d8a90',
            date_applied: moment().subtract(1, 'week').toDate(),
        });
        await newTalent.save();
    }
    // const inbox = await Inbox.find();
    // if (inbox.length === 0) {
    //     let newInbox = new Inbox({
    //         to: ['jaysencarlo13@gmail.com'],
    //         cc: ['jaysencarlo15@gmail.com'],
    //         bcc: ['jaysencarlo16@gmail.com'],
    //         from: 'jaysencarlo14@gmail.com',
    //         date: moment().subtract(12, 'days').toDate(),
    //         subject: 'This is first for example only',
    //         name: 'Loomvideo',
    //         body: {
    //             text: `bodybodybodybody`,
    //             html: `<div dir="ltr">Body<div><br></div><div>Body<br></div><div><br></div><div>Body<br></div><div><br></div><div>Body<br></div></div>`,
    //         },
    //     });
    //     await newInbox.save();
    //     newInbox = new Inbox({
    //         to: ['jaysencarlo13@gmail.com'],
    //         cc: ['jaysencarlo15@gmail.com'],
    //         bcc: ['jaysencarlo16@gmail.com'],
    //         from: 'jaysencarlo15@gmail.com',
    //         date: moment().subtract(11, 'days').toDate(),
    //         subject: 'This is second for example only',
    //         name: 'Hubstaff',
    //         body: {
    //             text: `bodybodybodybody`,
    //             html: `<div dir="ltr">Body<div><br></div><div>Body<br></div><div><br></div><div>Body<br></div><div><br></div><div>Body<br></div></div>`,
    //         },
    //     });
    //     await newInbox.save();
    //     newInbox = new Inbox({
    //         to: ['jaysencarlo13@gmail.com'],
    //         cc: ['jaysencarlo15@gmail.com'],
    //         bcc: ['jaysencarlo16@gmail.com'],
    //         from: 'liam@applicant.com',
    //         date: moment().subtract(10, 'days').toDate(),
    //         subject: 'This is third for example only',
    //         name: 'Jaysen',
    //         body: {
    //             text: `bodybodybodybody`,
    //             html: `<div dir="ltr">Body<div><br></div><div>Body<br></div><div><br></div><div>Body<br></div><div><br></div><div>Body<br></div></div>`,
    //         },
    //     });
    //     await newInbox.save();
    //     newInbox = new Inbox({
    //         to: ['jaysencarlo13@gmail.com'],
    //         cc: ['jaysencarlo15@gmail.com'],
    //         bcc: ['jaysencarlo16@gmail.com'],
    //         from: 'jaysencarlo14@gmail.com',
    //         date: moment().subtract(9, 'days').toDate(),
    //         subject: 'This is fourth for example only',
    //         name: 'Carlo',
    //         body: {
    //             text: `bodybodybodybody`,
    //             html: `<div dir="ltr">Body<div><br></div><div>Body<br></div><div><br></div><div>Body<br></div><div><br></div><div>Body<br></div></div>`,
    //         },
    //     });
    //     await newInbox.save();
    //     newInbox = new Inbox({
    //         to: ['jaysencarlo13@gmail.com'],
    //         cc: ['jaysencarlo15@gmail.com'],
    //         bcc: ['jaysencarlo16@gmail.com'],
    //         from: 'jaysencarlo14@gmail.com',
    //         date: moment().subtract(9, 'days').toDate(),
    //         subject: 'This is fourth for example only',
    //         name: 'Magno',
    //         body: {
    //             text: `bodybodybodybody`,
    //             html: `<div dir="ltr">Body<div><br></div><div>Body<br></div><div><br></div><div>Body<br></div><div><br></div><div>Body<br></div></div>`,
    //         },
    //     });
    //     await newInbox.save();
    // }
});

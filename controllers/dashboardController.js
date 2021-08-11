const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Candidates = require('../models/candidates');
const TalentPool = require('../models/talent_pool');

exports.checkAuth = (req, res, next) => {
    if (req.body) {
        return res.json({ isAuthenticated: true });
    }
};

exports.getDashboard = async (req, res, next) => {
    res.json({ isAuthenticated: true });
};

exports.postDashboard = async (req, res, next) => {};

exports.getUser = async (req, res, next) => {
    try {
        const { user } = req.body;
        const user_ = await User.findById(user._id);
        const { name, email, birthdate, home, contact } = user_;
        const organization_member = await Organization_Members.findOne({
            member_id: user._id,
        });
        if (organization_member && organization_member.length) {
            const { employee_id, status, department, title, join_date } = organization_member;
            return res.json({
                user: {
                    personal_info: {
                        name,
                        email,
                        birthdate,
                        home,
                        contact,
                    },
                    work_info: {
                        employee_id,
                        status,
                        department,
                        title,
                        join_date,
                    },
                },
            });
        } else
            return res.json({
                user: {
                    personal_info: {
                        name,
                        email,
                        birthdate,
                        home,
                        contact,
                    },
                    work_info: {
                        employee_id: '',
                        status: '',
                        department: '',
                        title: '',
                        join_date: '',
                    },
                },
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something went wrong' });
    }
};

exports.getLogout = async (req, res, next) => {
    console.log('here');
    try {
        const { sessionID } = req.body;
        if (sessionID) {
            console.log('here');
            req.logout();
            await Session.findByIdAndDelete(sessionID);
            res.json({ isLogout: true, message: 'Success' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something went wrong!' });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        if (req.body) {
            const { personal_info, work_info, user } = req.body;
            await User.updateOne(
                { _id: user._id },
                {
                    ...personal_info,
                }
            );
            await Organization_Members.findOneAndUpdate({ member_id: user._id }, { ...work_info });
            return res.json({ isUpdated: true, message: 'Success updating user' });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went wrong!' });
    }
};

exports.changepassword = async (req, res, next) => {
    try {
        if (req.body) {
            const { password, newpassword, user } = req.body;
            const userthis = await User.findById(user._id);
            const isValid = await userthis.checkPassword(password);
            if (isValid) {
                userthis.password = newpassword;
                await userthis.save();
                res.json({ isChangePassword: true, message: 'Success Changing Password' });
            } else {
                res.json({ isChangePassword: false, message: 'Password Incorrect' });
            }
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went Wrong' });
    }
};

exports.getMyInterviews = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const arrayToday = [];
            const arrayMissed = [];
            const arrayUpcoming = [];
            const arrayReferrals = [];
            const arrayBirthdaycorner = [];
            const arrayNewJoinees = [];

            const users = await User.find();
            const applicant = await Applicants.find();
            const job_postings = await JobPostings.find();
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const myinterviews_today = await Interviews.find({
                interviewer: user._id,
                date_time: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() },
            });
            const myinterviews_missed = await Interviews.find({
                interviewer: user._id,
                date_time: { $lte: moment().startOf('day').toDate() },
            });
            const myinterviews_upcoming = await Interviews.find({
                interviewer: user._id,
                date_time: { $gte: moment().startOf('day').toDate() },
            });
            const myReferrals_candidate = await Candidates.find({ referred_by: user._id });
            const myReferrals_talentpool = await TalentPool.find({ referred_by: user._id });
            const birthdayCorner = await User.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: [{ $month: '$birthdate' }, { $month: moment().toDate() }],
                                },
                                {
                                    $gte: [{ $dayOfMonth: '$birthdate' }, { $dayOfMonth: moment().toDate() }],
                                },
                                {
                                    $lte: [
                                        { $dayOfMonth: '$birthdate' },
                                        { $dayOfMonth: moment().endOf('month').toDate() },
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        birthdate: 1,
                    },
                },
            ]);
            const newJoinees = await Organization_Members.find({
                organization_id,
                join_date: {
                    $gte: moment().subtract(7, 'days').toDate(),
                    $lte: moment().toDate(),
                },
            });

            if (myinterviews_today.length) {
                myinterviews_today.forEach((element) => {
                    const userthis = applicant.find(
                        (e) => e._id.toString() === element.interviewee.toString()
                    );
                    const name = userthis.personal_info.name;
                    const email = userthis.personal_info.email;
                    const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString()).name;
                    const date_time = element.date_time;
                    arrayToday.push({
                        name: name,
                        email: email,
                        assignBy: assignBy,
                        date_time: date_time,
                    });
                });
            }
            if (myinterviews_missed.length) {
                myinterviews_missed.forEach((element) => {
                    const userthis = applicant.find(
                        (e) => e._id.toString() === element.interviewee.toString()
                    );
                    const name = userthis.personal_info.name;
                    const email = userthis.personal_info.email;
                    const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString()).name;
                    const date_time = element.date_time;
                    arrayMissed.push({
                        name: name,
                        email: email,
                        assignBy: assignBy,
                        date_time: date_time,
                    });
                });
            }
            if (myinterviews_upcoming.length) {
                myinterviews_upcoming.forEach((element) => {
                    const userthis = applicant.find(
                        (e) => e._id.toString() === element.interviewee.toString()
                    );
                    const name = userthis.personal_info.name || '';
                    const email = userthis.personal_info.email || '';
                    const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString()).name;
                    const date_time = element.date_time;
                    arrayUpcoming.push({
                        name: name,
                        email: email,
                        assignBy: assignBy,
                        date_time: date_time,
                    });
                });
            }
            if (myReferrals_candidate.length || myReferrals_talentpool.length) {
                console.log(myReferrals_candidate);
                if (myReferrals_candidate.length)
                    myReferrals_candidate.forEach((element) => {
                        const { applicant_id, date_applied, status, job_posting_id } = element;
                        const { personal_info } = applicant.find(
                            (e) => e._id.toString() === applicant_id.toString()
                        );
                        const { name, email } = personal_info;
                        const { title } = job_postings.find(
                            (e) => e._id.toString() === job_posting_id.toString()
                        );
                        arrayReferrals.push({
                            name,
                            email,
                            applied_job: title ? `${title}/${status}` : 'Job is Unavailable',
                            date_applied: moment(date_applied).format('MMMM DD, YYYY'),
                        });
                    });
                if (myReferrals_talentpool.length)
                    myReferrals_talentpool.forEach((element) => {
                        const { applicant_id, date_applied, status, job_posting_id } = element;
                        const { personal_info } = applicant.find(
                            (e) => e._id.toString() === applicant_id.toString()
                        );
                        const { name, email } = personal_info;
                        const { title } = job_postings.find(
                            (e) => e._id.toString() === job_posting_id.toString()
                        );
                        arrayReferrals.push({
                            name,
                            email,
                            applied_job: title ? `${title}/${status}` : 'Job is Unavailable',
                            date_applied: moment(date_applied).format('MMMM DD, YYYY'),
                        });
                    });
            }
            if (birthdayCorner.length) {
                birthdayCorner.forEach((element) => {
                    const { name, birthdate } = element;
                    arrayBirthdaycorner.push({
                        name: name,
                        birthdate: moment(birthdate).format('MMMM DD'),
                    });
                });
            }
            if (newJoinees.length) {
                newJoinees.forEach(({ member_id, department, title, join_date }) => {
                    const { name, email } = users.find((e) => e._id.toString() === member_id.toString());
                    arrayNewJoinees.push({
                        name,
                        email,
                        department,
                        title,
                        join_date: moment(join_date).format('MMMM DD, YYYY'),
                    });
                });
            }
            res.json({
                isSuccess: true,
                today: arrayToday,
                missed: arrayMissed,
                upcoming: arrayUpcoming,
                referrals: arrayReferrals,
                birthday_corner: arrayBirthdaycorner,
                new_joinees: arrayNewJoinees,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.updateGoogle = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, google } = req.body;
            const { email, password } = google;
            const update_user = await User.findById(user._id);
            update_user.google.username = email;
            update_user.google.password = password;
            await update_user.save();
            res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.transfer = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const { _id, name, email, birthdate, password, contact, home } = await User.findById(user._id);
            const applicant = new Applicants({
                personal_info: {
                    name,
                    birthdate,
                    home,
                    email,
                    contact,
                },
                password,
                isTransfer: true,
            });
            await applicant.save();
            await Organization_Members.deleteMany({ member_id: _id });
            await User.findByIdAndDelete(_id);
            return res.json({
                isSuccess: true,
                message:
                    'Success Transfering this account to applicant. Please logout and login in applicants login page. Thank you',
            });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Transfering Failed. Something Went Wrong' });
    }
};

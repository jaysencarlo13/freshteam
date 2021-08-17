const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Candidates = require('../models/candidates');
const Talentpool = require('../models/talent_pool');
const OrganizationHistory = require('../models/organization_history');
const nodemailer = require('nodemailer');

exports.recruitment = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const arrayJobs = [];

            const { organization_id } = await Organization_Members.findOne({
                member_id: user._id,
            });
            const job_posting = await JobPostings.find({
                organization_id: organization_id,
            }).sort({ createdAt: -1 });
            const candidate = await Candidates.find({});

            if (job_posting.length) {
                job_posting.forEach(({ _id, title, range, type, createdAt }) => {
                    let number = 0;
                    if (candidate.length !== 0) {
                        candidate.forEach(({ job_posting_id }) => {
                            if (job_posting_id.toString() === _id.toString()) number++;
                        });
                    }
                    arrayJobs.push({
                        id: _id,
                        title: title,
                        range: range,
                        type: type,
                        candidates: number,
                        createdAt: moment(createdAt).format('LLL'),
                    });
                });
            }

            return res.json({ isSuccess: true, message: 'Success', jobs: arrayJobs });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something Went Wrong!' });
    }
};

exports.candidates = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, postid } = req.body;
            const arrayCandidates = [];
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const { google } = await User.findById(user._id);
            const job_postings = await JobPostings.find({ organization_id }, '_id');
            const candidates = postid
                ? await Candidates.find({ job_posting_id: postid })
                : await Candidates.find({ job_posting_id: [...job_postings] });

            const applicants = await Applicants.find();
            const job_posting = await JobPostings.find();
            if (candidates) {
                candidates.forEach(({ _id, applicant_id, job_posting_id, status }) => {
                    const { personal_info } = applicants.find(
                        (e) => e._id.toString() === applicant_id.toString()
                    );
                    const { name, email, contact } = personal_info;
                    const { title } = job_posting.find((e) => e._id.toString() === job_posting_id.toString());
                    arrayCandidates.push({
                        candidate_id: _id,
                        applicant_id,
                        name,
                        email,
                        contact,
                        title,
                        status,
                    });
                });
            }
            return res.json({
                isSuccess: true,
                message: 'Success',
                candidates: arrayCandidates,
                messenger: {
                    username: google.username,
                    isGoogleSetup: google.username !== '' || google.password !== '' ? true : false,
                },
            });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.fetchinfo = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, applicantId } = req.body;
            const { name, google } = await User.findById(user._id);
            const applicant = await Applicants.findById(applicantId);
            const isPersonalInfo = applicant.personal_info ? true : false;
            const isWorkExperience = applicant.work_experience.length > 0 ? true : false;
            const isEducation = applicant.education.length > 0 ? true : false;
            const isSkills = applicant.skills.length > 0 ? true : false;
            const isCertification = applicant.certification_licenses.length > 0 ? true : false;
            return res.json({
                isSuccess: true,
                message: 'Success',
                applicant: {
                    isPersonalInfo,
                    isWorkExperience,
                    isEducation,
                    isSkills,
                    isCertification,
                    applicant,
                },
                isGoogleSetup: google
                    ? google.username !== '' && google.password !== ''
                        ? true
                        : false
                    : false,
                google_email: google.username,
                name,
            });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong!' });
    }
};

exports.update = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, status, candidate_id, message, interview } = req.body;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const { applicant_id: appId } = await Candidates.findById(candidate_id);
            const { to, cc, from, subject, text, html } = message;
            const thisuser = await User.findById(user._id);
            const googlepassword = await thisuser.GooglePassword();
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: thisuser.google.username,
                    pass: googlepassword,
                },
                priority: 'high',
            });
            await transporter.sendMail({
                from: thisuser.google.username,
                to,
                cc,
                subject,
                text,
                html,
            });

            if (status === 'Interview') {
                const interview_ = new Interviews({
                    interviewer: interview.interviewer_id,
                    interviewee: appId,
                    assignBy: user._id,
                    date_time: moment(interview.date + ' ' + interview.time, 'YYYY-MM-DD HH:mm').toDate(),
                    location: 'via skype',
                });
                await interview_.save();
            }

            if (status !== 'Hired') {
                const candidate = await Candidates.findByIdAndUpdate(candidate_id, { status: status });
                return res.json({ isSuccess: true, message: 'Success' });
            } else if (status === 'Hired') {
                //insert into users, update usertype into employee
                const candidate = await Candidates.findById(candidate_id);
                const applicant = await Applicants.findById(candidate.applicant_id);
                const { personal_info, password } = applicant;
                const { name, birthdate, home, email, contact } = personal_info;
                const user_ = new User({
                    name,
                    email,
                    birthdate,
                    password,
                    contact,
                    home,
                    user_type: 'employee',
                    isCandidate: true,
                });
                await user_.save();
                const organization_member = new Organization_Members({
                    member_id: user_._id,
                    organization_id,
                });
                await organization_member.save();
                //delete this candidate and applicant
                await Candidates.deleteMany({ applicant_id: applicant._id });
                await Talentpool.deleteMany({ applicant_id: applicant._id });
                await Applicants.findByIdAndDelete(applicant._id);
                const orgHistory = new OrganizationHistory({
                    organization_id,
                    hired: {
                        date: moment().toDate(),
                        hired_by: user._id,
                    },
                });
                await orgHistory.save();
                return res.json({
                    isSuccess: true,
                    message:
                        'Candidate is now successfully Hired and is now transferred to employee section. Please inform the applicant to login in employee/employer login page. Thank you',
                });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.remove = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, candidate_id, message } = req.body;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const { to, cc, from, subject, text, html } = message;
            const thisuser = await User.findById(user._id);
            const googlepassword = await thisuser.GooglePassword();
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: thisuser.google.username,
                    pass: googlepassword,
                },
                priority: 'high',
            });
            await transporter.sendMail({
                from: thisuser.google.username,
                to,
                cc,
                subject,
                text,
                html,
            });
            await Candidates.findByIdAndRemove(candidate_id);
            const orgHistory = new OrganizationHistory({
                organization_id,
                rejected_candidates: {
                    date: moment().toDate(),
                    rejected_by: user._id,
                },
            });
            await orgHistory.save();
            return res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        if (err.responseCode === 535)
            return res.status(500).json({
                error: err,
                message:
                    'Google Username or Password is incorrect. Check and input your google account credentials.',
                responseCode: err.responseCode,
            });
        return res.status(500).json({ error: err, message: 'Remove Failed!. Something Went Wrong' });
    }
};

exports.talentpool = async (req, res, next) => {
    try {
        if (req.body) {
            let arrayTalent = [];
            let { user, search } = req.body;
            search = search === '' ? undefined : search;
            const user_ = await User.findById(user._id);
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const jobpost = search
                ? await JobPostings.find(
                      { organization_id, title: { $regex: search, $options: 'i' } },
                      '_id title'
                  )
                : await JobPostings.find({ organization_id }, '_id title');
            const talentpool = await Talentpool.find(
                {
                    job_posting_id: [
                        ...jobpost.map((e) => {
                            return e._id;
                        }),
                    ],
                },
                '_id job_posting_id applicant_id date_applied referred_by'
            );
            const applicant = await Applicants.find(
                {
                    _id: [
                        ...talentpool.map((e) => {
                            return e.applicant_id;
                        }),
                    ],
                },
                '_id personal_info work_experience education skills certification_licenses additional_information file'
            );

            talentpool.forEach(({ _id, job_posting_id, applicant_id, date_applied, referred_by }) => {
                const {
                    personal_info,
                    work_experience,
                    education,
                    skills,
                    certification_licenses,
                    additional_information,
                    file,
                } = applicant.find((e) => e._id.toString() === applicant_id.toString());
                const { title } = jobpost.find((e) => e._id.toString() === job_posting_id.toString());
                arrayTalent.push({
                    talentpool_id: _id,
                    job_posting_id,
                    applicant_id,
                    date_applied,
                    personal_info,
                    work_experience,
                    education,
                    skills,
                    certification_licenses,
                    additional_information,
                    file,
                    title,
                    referred_by,
                    messenger: {
                        isGoogleSetup:
                            user_.google.username != '' && user_.google.password != '' ? true : false,
                        email: user_.google.username,
                    },
                });
            });
            res.json({ isSuccess: true, message: 'Success', talentpool: arrayTalent });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went wrong' });
    }
};

exports.talentpool_add = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, talentpool, message } = req.body;
            const { talentpool_id, job_posting_id, applicant_id, date_applied, referred_by } = talentpool;
            const { to, cc, from, subject, text, html } = message;
            const thisuser = await User.findById(user._id);
            const googlepassword = await thisuser.GooglePassword();
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: thisuser.google.username,
                    pass: googlepassword,
                },
                priority: 'high',
            });
            await transporter.sendMail({
                from: thisuser.google.username,
                to,
                cc,
                subject,
                text,
                html,
            });
            const newCandidate = new Candidates({
                job_posting_id,
                applicant_id,
                date_applied,
                referred_by,
            });
            await newCandidate.save();
            await Talentpool.findByIdAndDelete(talentpool_id);
            return res.json({ isSuccess: true, message: 'Adding to Candidates Success' });
        }
    } catch (err) {
        if (err.responseCode === 535)
            return res.status(500).json({
                error: err,
                message:
                    'Google Username or Password is incorrect. Check and input your google account credentials.',
                responseCode: err.responseCode,
            });
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.talentpool_remove = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, talentpool, message } = req.body;
            const { to, cc, from, subject, text, html } = message;
            const thisuser = await User.findById(user._id);
            const googlepassword = await thisuser.GooglePassword();
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: thisuser.google.username,
                    pass: googlepassword,
                },
                priority: 'high',
            });
            await transporter.sendMail({
                from: thisuser.google.username,
                to,
                cc,
                subject,
                text,
                html,
            });
            await Talentpool.findByIdAndDelete(talentpool['talentpool_id']);
            return res.json({ isSuccess: true, message: 'Removing from talent pool Success' });
        }
    } catch (err) {
        if (err.responseCode === 535)
            return res.status(500).json({
                error: err,
                message:
                    'Google Username or Password is incorrect. Check and input your google account credentials.',
                responseCode: err.responseCode,
            });
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

const { FilterArray } = require('../models/methods');
const Users = require('../models/user');
const moment = require('moment');
const nodemailer = require('nodemailer');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Candidates = require('../models/candidates');
const TalentPool = require('../models/talent_pool');
const Inbox = require('../models/inbox');

exports.inbox = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, trigger } = req.body;
            const thisuser = await Users.findById(user._id);
            const { organization_id } = await Organization_Members.findOne({ member_id: thisuser._id });
            if (trigger === 'all') {
                const inbox = await Inbox.find({ to: { $in: [thisuser.email] } }).sort({ date: '-1' });
                return res.json({
                    isSuccess: true,
                    message: 'Success',
                    messages: inbox,
                    email: thisuser.google.username,
                });
            } else if (trigger === 'candidates') {
                const job_postings = await JobPostings.find({ organization_id }, '_id');
                const candidates = FilterArray(
                    await Candidates.find({ job_posting_id: [...job_postings] }, '-_id applicant_id'),
                    'applicant_id'
                );
                const applicants = FilterArray(
                    await Applicants.find({ _id: [...candidates] }, '-_id personal_info.email'),
                    'personal_info',
                    'email'
                );
                const inbox = await Inbox.find({ from: [...applicants], to: { $in: [thisuser.email] } }).sort(
                    {
                        date: '-1',
                    }
                );
                return res.json({
                    isSuccess: true,
                    message: 'Success',
                    messages: inbox,
                    email: thisuser.google.username,
                });
            } else if (trigger === 'work') {
                const members = FilterArray(
                    await Organization_Members.find({ organization_id }, '-_id member_id'),
                    'member_id'
                );
                const users = FilterArray(await Users.find({ _id: [...members] }), 'google', 'username');
                const inbox = await Inbox.find({ from: [...users], to: { $in: [thisuser.email] } }).sort({
                    date: '-1',
                });
                return res.json({
                    isSuccess: true,
                    message: 'Success',
                    messages: inbox,
                    email: thisuser.google.username,
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.check = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const { google } = await Users.findById(user._id);
            const { username, password } = google;
            if (username === '' || password === '') return res.json({ isSetup: false });
            return res.json({ isSetup: true });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.reply = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, message } = req.body;
            const { to, cc, bcc, from, message_id, subject, text, html } = message;
            const thisuser = await Users.findById(user._id);
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
                inReplyTo: message_id,
                replyTo: from,
                to,
                cc,
                bcc,
                subject,
                text,
                html,
                references: [message_id],
            });
            return res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.send = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, message } = req.body;
            const { to, cc, bcc, from, subject, text, html } = message;
            const thisuser = await Users.findById(user._id);
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
                from,
                to,
                cc,
                bcc,
                subject,
                text,
                html,
            });
            return res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.search = async (req, res, next) => {
    try {
        if (req.body) {
            let { user, search } = req.body;
            search = search === '' ? undefined : search;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const members = FilterArray(await Organization_Members.find({ organization_id }), 'member_id');
            let users_ = search
                ? await Users.find(
                      { _id: [...members], name: { $regex: search, $options: 'i' } },
                      '-_id name google.username'
                  ).sort({ name: 1 })
                : await Users.find({ _id: [...members] }, '-_id name google.username').sort({
                      name: 1,
                  });
            let users = [];
            users_.forEach((element) => {
                if (element.name !== '' && element.google.username !== '')
                    users.push({ name: element.name, email: element.google.username });
            });
            return res.json({ isSuccess: true, suggestions: users });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

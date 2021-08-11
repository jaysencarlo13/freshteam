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

exports.employees = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            let { user, search, category } = req.body;
            search = search ? search : undefined;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const organization_members = search
                ? category === 'title'
                    ? await Organization_Members.find({
                          organization_id,
                          title: { $regex: search, $options: 'i' },
                      })
                    : await Organization_Members.find({ organization_id })
                : await Organization_Members.find({ organization_id });
            const members_id = FilterArray(organization_members, 'member_id');
            const users = search
                ? category === 'name'
                    ? await Users.find({
                          _id: [...members_id],
                          name: { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : category === 'email'
                    ? await Users.find({
                          _id: [...members_id],
                          'google.username': { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : await Users.find({ _id: [...members_id] }).sort({ name: 1 })
                : await Users.find({ _id: [...members_id] }).sort({ name: 1 });
            users.forEach(({ _id, name, google, birthdate, contact, home }) => {
                const { username } = google;
                let { status, department, title, join_date, employee_id } = organization_members.find(
                    (e) => e.member_id.toString() === _id.toString()
                );
                join_date = moment(join_date).format('MMMM DD, YYYY');
                birthdate = moment(birthdate).format('MMMM DD, YYYY');
                array.push({
                    _id,
                    name,
                    birthdate,
                    contact,
                    home,
                    status,
                    department,
                    title,
                    join_date,
                    employee_id,
                    email: username ? username : 'Google Not Yet Setup',
                });
            });
            return res.json({ isSuccess: true, table: array });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.employee_update = async (req, res, next) => {
    try {
        if (req.body) {
            const { employee } = req.body;
            let { _id, name, birthdate, contact, home, employee_id, department, title, join_date } = employee;
            birthdate = moment(birthdate, 'MMMM DD, YYYY');
            await Users.findByIdAndUpdate(_id, { name, birthdate, contact, home });
            await Organization_Members.findOneAndUpdate(
                { member_id: _id },
                { employee_id, department, title, join_date }
            );
            return res.json({ isSuccess: true, message: 'Success Updating ' + name });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Updating Failed. Something Went Wrong' });
    }
};

exports.onboarding = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            let { user, search, category } = req.body;
            search = search ? search : undefined;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const organization_members = search
                ? category === 'title'
                    ? await Organization_Members.find({
                          organization_id,
                          title: { $regex: search, $options: 'i' },
                          join_date: {
                              $lte: moment().endOf('day').toDate(),
                              $gte: moment().subtract(30, 'days').startOf('day').toDate(),
                          },
                      })
                    : await Organization_Members.find({
                          organization_id,
                          join_date: {
                              $lte: moment().endOf('day').toDate(),
                              $gte: moment().subtract(30, 'days').startOf('day').toDate(),
                          },
                      })
                : await Organization_Members.find({
                      organization_id,
                      join_date: {
                          $lte: moment().endOf('day').toDate(),
                          $gte: moment().subtract(30, 'days').startOf('day').toDate(),
                      },
                  });
            const members_id = FilterArray(organization_members, 'member_id');
            const users = search
                ? category === 'name'
                    ? await Users.find({
                          _id: [...members_id],
                          name: { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : category === 'email'
                    ? await Users.find({
                          _id: [...members_id],
                          'google.username': { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : await Users.find({ _id: [...members_id] }).sort({ name: 1 })
                : await Users.find({ _id: [...members_id] }).sort({ name: 1 });
            users.forEach(({ _id, name, google, birthdate, contact, home }) => {
                const { username } = google;
                let { status, department, title, join_date, employee_id } = organization_members.find(
                    (e) => e.member_id.toString() === _id.toString()
                );
                join_date = moment(join_date).format('MMMM DD, YYYY');
                birthdate = moment(birthdate).format('MMMM DD');
                array.push({
                    _id,
                    name,
                    birthdate,
                    contact,
                    home,
                    status,
                    department,
                    title,
                    join_date,
                    employee_id,
                    email: username ? username : 'Google Not Yet Setup',
                });
            });
            return res.json({ isSuccess: true, table: array });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.offboarding = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            let { user, search, category } = req.body;
            search = search ? search : undefined;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const organization_members = search
                ? category === 'title'
                    ? await Organization_Members.find({
                          organization_id,
                          title: { $regex: search, $options: 'i' },
                          status: 'offboarding',
                      })
                    : await Organization_Members.find({ organization_id, status: 'offboarding' })
                : await Organization_Members.find({ organization_id, status: 'offboarding' });
            const members_id = FilterArray(organization_members, 'member_id');
            const users = search
                ? category === 'name'
                    ? await Users.find({
                          _id: [...members_id],
                          name: { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : category === 'email'
                    ? await Users.find({
                          _id: [...members_id],
                          'google.username': { $regex: search, $options: 'i' },
                      }).sort({ name: 1 })
                    : await Users.find({ _id: [...members_id] }).sort({ name: 1 })
                : await Users.find({ _id: [...members_id] }).sort({ name: 1 });
            users.forEach(({ _id, name, google, birthdate, contact, home }) => {
                const { username } = google;
                let { status, department, title, join_date, employee_id } = organization_members.find(
                    (e) => e.member_id.toString() === _id.toString()
                );
                join_date = moment(join_date).format('MMMM DD, YYYY');
                birthdate = moment(birthdate).format('MMMM DD');
                array.push({
                    _id,
                    name,
                    birthdate,
                    contact,
                    home,
                    status,
                    department,
                    title,
                    join_date,
                    employee_id,
                    email: username ? username : 'Google Not Yet Setup',
                });
            });
            return res.json({ isSuccess: true, table: array });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.offboarding_accept = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id_remove } = req.body;
            let user_ = await Users.findById(id_remove);
            user_.user_type = 'fresh';
            await user_.save();
            await Organization_Members.findOneAndDelete({ member_id: id_remove });
            return res.json({
                isSuccess: true,
                message: 'Success removing ' + user_.name + ' to your organization.',
            });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Accept Failed. Something Went Wrong' });
    }
};

exports.offboarding_reject = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id } = req.body;
            const user_ = await Users.findById(id);
            let organization_member = await Organization_Members.findOne({ member_id: id });
            organization_member.status = 'Active';
            await organization_member.save();
            return res.json({ isSuccess: true, message: 'Success rejecting offboarding of ' + user_.name });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Reject Failed. Something Went Wrong' });
    }
};

exports.offboarding_request = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const organization_member = await Organization_Members.findOne({ member_id: user._id });
            organization_member.status = 'offboarding';
            await organization_member.save();
            return res.json({
                isSuccess: true,
                message: 'Success requesting offboard. Admin will review your request',
            });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Request Failed. Something Went Wrong' });
    }
};

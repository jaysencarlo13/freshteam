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
const Timeoff = require('../models/timeoff');

exports.timeoff = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            let { user: _user, filter } = req.body;
            filter = filter ? filter : undefined;
            const { organization_id, timeoff: _timeoff } = await Organization_Members.findOne({
                member_id: _user._id,
            });
            const users = await Users.find();
            const timeoff = filter
                ? await Timeoff.find({
                      organization_id,
                      member_id: _user._id,
                      date: {
                          $gte: moment(filter[0]).startOf('day').toDate(),
                          $lte: moment(filter[1]).endOf('day').toDate(),
                      },
                  })
                : await Timeoff.find({
                      organization_id,
                      member_id: _user._id,
                      date: {
                          $gte: moment().startOf('month').toDate(),
                          $lte: moment().endOf('month').toDate(),
                      },
                  });
            timeoff.forEach(({ _id, date, status, createdAt, member_id }) => {
                date = moment(date).format('LL');
                createdAt = moment(createdAt).format('LL');
                let { name } = users.find((element) => element._id.toString() === member_id.toString());
                array.push({
                    _id,
                    date,
                    status,
                    name,
                    createdAt,
                });
            });
            return res.json({ isSuccess: true, message: 'Success', table: array, remaining: _timeoff });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.request = async (req, res, next) => {
    try {
        if (req.body) {
            const { user: _user, array: _array, remaining } = req.body;
            const { organization_id } = await Organization_Members.findOne({ member_id: _user._id });

            let array = [];

            _array.forEach(({ id, date }) => {
                const _date = moment(date).toDate();
                array.push({
                    organization_id,
                    member_id: _user._id,
                    date,
                });
            });

            await Timeoff.insertMany(array);

            return res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went wrong while requesting.' });
    }
};

exports.timeoff_employees = async (req, res, next) => {
    try {
        if (req.body) {
            let array = [];
            let { user: _user, filter } = req.body;
            filter = filter ? filter : undefined;
            const { organization_id, timeoff: _timeoff } = await Organization_Members.findOne({
                member_id: _user._id,
            });
            const users = await Users.find();
            const timeoff = filter
                ? await Timeoff.find({
                      organization_id,
                      date: {
                          $gte: moment(filter[0]).startOf('day').toDate(),
                          $lte: moment(filter[1]).endOf('day').toDate(),
                      },
                  })
                : await Timeoff.find({
                      organization_id,
                      date: {
                          $gte: moment().startOf('month').toDate(),
                          $lte: moment().endOf('month').toDate(),
                      },
                  });
            timeoff.forEach(({ _id, date, status, createdAt, member_id }) => {
                date = moment(date).format('LL');
                createdAt = moment(createdAt).format('LL');
                let { name } = users.find((element) => element._id.toString() === member_id.toString());
                array.push({
                    _id,
                    date,
                    status,
                    name,
                    createdAt,
                    member_id,
                });
            });
            return res.json({ isSuccess: true, message: 'Success', table: array, remaining: _timeoff });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went Wrong!' });
    }
};

exports.accept = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id, member_id } = req.body;
            let organization_member = await Organization_Members.findOne({ member_id });
            if (organization_member.timeoff === 0)
                return res.status(500).json({ error: err, message: 'Insufficient timeoff for this user' });
            await Timeoff.findByIdAndUpdate(id, { status: 'Accepted' });
            await Organization_Members.findOne({ member_id }, { timeoff: organization_member.timeoff - 1 });
            return res.json({ isSuccess: true, message: 'Accept Success' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, message: 'Accept Failed. Something Went Wrong' });
    }
};

exports.reject = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id } = req.body;
            await Timeoff.findByIdAndUpdate(id, { status: 'Rejected' });
            return res.json({ isSuccess: true, message: 'Reject Success' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, message: 'Accept Failed. Something Went Wrong' });
    }
};

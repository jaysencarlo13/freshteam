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
const Organization_History = require('../models/organization_history');

exports.reports = async (req, res, next) => {
    try {
        if (req.body) {
            const { user } = req.body;
            const labels = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            let datasets = [
                {
                    label: '# of Rejected Candidates',
                    data: [12, 19, 3, 5, 2, 3, 0, 0, 0, 0, 0, 0],
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                },
            ];
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            let rejected_candidates = await Organization_History.aggregate([
                {
                    $match: {
                        organization_id: organization_id,
                        'rejected_candidates.date': {
                            $gte: moment().subtract(1, 'year').toDate(),
                            $lte: moment().toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { date: '$rejected_candidates.date', format: '%Y-%m' },
                        },
                        total_count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year_month: '$_id',
                        total_count: 1,
                    },
                },
            ]);
            let job_postings = await Organization_History.aggregate([
                {
                    $match: {
                        organization_id: organization_id,
                        'job_postings.date': {
                            $gte: moment().subtract(1, 'year').toDate(),
                            $lte: moment().toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { date: '$job_postings.date', format: '%Y-%m' },
                        },
                        total_count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year_month: '$_id',
                        total_count: 1,
                    },
                },
            ]);
            let hired = await Organization_History.aggregate([
                {
                    $match: {
                        organization_id: organization_id,
                        'hired.date': {
                            $gte: moment().subtract(1, 'year').toDate(),
                            $lte: moment().toDate(),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { date: '$hired.date', format: '%Y-%m' },
                        },
                        total_count: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        _id: 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        year_month: '$_id',
                        total_count: 1,
                    },
                },
            ]);
            let arrayMonth = [],
                arrayRejected_labels = [],
                arrayRejected_data = [],
                arrayPost_labels = [],
                arrayPost_data = [],
                arrayHired_labels = [],
                arrayHired_data = [];
            for (let index = 1; index <= 12; index++) {
                arrayMonth.push(moment().subtract(index, 'month').format('YYYY-MM'));
            }
            arrayMonth.sort();
            arrayMonth.forEach((month) => {
                const reject = rejected_candidates.find((element) => element.year_month === month);
                const post = job_postings.find((element) => element.year_month === month);
                const hire = hired.find((element) => element.year_month === month);
                if (reject) {
                    arrayRejected_labels.push(moment(reject.year_month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayRejected_data.push(reject.total_count);
                } else {
                    arrayRejected_labels.push(moment(month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayRejected_data.push(0);
                }
                if (post) {
                    arrayPost_labels.push(moment(post.year_month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayPost_data.push(post.total_count);
                } else {
                    arrayPost_labels.push(moment(month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayPost_data.push(0);
                }
                if (hire) {
                    arrayHired_labels.push(moment(hire.year_month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayHired_data.push(hire.total_count);
                } else {
                    arrayHired_labels.push(moment(month, 'YYYY-MM').format('MMMM YYYY'));
                    arrayHired_data.push(0);
                }
            });
            return res.json({
                isSuccess: true,
                rejected_candidates: { labels: arrayRejected_labels, data: arrayRejected_data },
                job_postings: { labels: arrayPost_labels, data: arrayPost_data },
                hired: { labels: arrayHired_labels, data: arrayHired_data },
            });
        }
    } catch (err) {
        return res.status.json({ error: err, message: 'Something Went Wrong' });
    }
};

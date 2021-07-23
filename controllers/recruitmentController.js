const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Candidates = require('../models/candidates');

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
            console.log(postid);
            res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Candidates = require('../models/candidates');
const Organization = require('../models/organization');

exports.view = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, post_id } = req.body;
            if (post_id === '' || post_id === undefined) {
                return res.json({ isSuccess: false, message: 'No Job Post' });
            }
            const { _id, organization_id, created_by, title, range, type, editor } =
                await JobPostings.findById({
                    _id: post_id,
                });
            const { name } = await User.findById(created_by);
            return res.json({
                isSuccess: true,
                message: 'Success',
                job_post: { _id, organization_id, created_by: name, title, range, type, editor },
            });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something Went Wrong!' });
    }
};

exports.update = async (req, res, next) => {
    try {
        if (req.body) {
            const { _id, organization_id, title, range, type, editor } = req.body;
            await JobPostings.findByIdAndUpdate(_id, { title, range, type, editor });
            return res.json({ isSuccess: true, message: 'Update Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went Wrong' });
    }
};

exports.fetchJobPost = async (req, res, next) => {
    try {
        if (req.query) {
            const { search } = req.query;
            const organizations = await Organization.find();
            const arrayJob = [];
            const jobpost = search
                ? await JobPostings.find({ title: { $regex: search, $options: 'i' } }).sort({
                      createdAt: -1,
                  })
                : await JobPostings.find().sort({
                      createdAt: -1,
                  });
            jobpost.forEach(({ _id, organization_id, title, range, type }) => {
                const { name, description, headquarters, industry } = organizations.find(
                    (e) => e._id.toString() === organization_id.toString()
                );
                arrayJob.push({
                    _id,
                    title,
                    range,
                    type,
                    name,
                    description,
                    headquarters,
                    industry,
                });
            });
            return res.json({ isSuccess: true, jobpost: arrayJob });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went Wrong' });
    }
};

exports.fetchById = async (req, res, next) => {
    try {
        if (req.query) {
            const { postid } = req.query;
            const organizations = await Organization.find();
            const { _id, title, range, type, editor, organization_id } = await JobPostings.findById(postid);

            const { name, description, headquarters, industry } = organizations.find(
                (e) => e._id.toString() === organization_id.toString()
            );
            return res.json({
                isSuccess: true,
                jobpost: {
                    _id,
                    name,
                    description,
                    headquarters,
                    industry,
                    title,
                    range,
                    type,
                    editor,
                },
            });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something went Wrong' });
    }
};

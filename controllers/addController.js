const Organizations = require('../models/organization');
const Users = require('../models/user');
const Organization_Members = require('../models/organization_members');
const JobPostings = require('../models/job_postings');

exports.add_department = async (req, res, next) => {
    try {
        if (req.body) {
            const { department, user } = req.body;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const organization = await Organizations.findById(organization_id);
            organization.departments = [...organization.departments, { name: department }];
            await organization.save();
            res.json({ message: 'Success Adding Department', isSuccess: true });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something Went Wrong!' });
    }
};

exports.add_employee = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, employee_email } = req.body;
            const thisuser = await Organization_Members.findOne({ member_id: user._id });
            const user_to_be_add = await Users.findOne({ email: employee_email });
            if (!user_to_be_add)
                return res.json({
                    isSuccess: false,
                    message:
                        'User is not yet registered. Please make sure that the user is register before adding to your Organization. Thank you!',
                });

            const isMember = await Organization_Members.findOne({
                member_id: user_to_be_add._id,
                organization_id: thisuser.organization_id,
            });

            if (isMember) {
                return res.json({
                    isSuccess: false,
                    message: 'User is already added to the organization.',
                });
            }

            const isMember_toOtherOrg = await Organization_Members.findOne({ member_id: user_to_be_add._id });

            if (isMember_toOtherOrg) {
                return res.json({
                    isSuccess: true,
                    message: 'User is in different organization',
                });
            }

            const newuser = new Organization_Members({
                organization_id: thisuser.organization_id,
                member_id: user_to_be_add._id,
            });
            await newuser.save();
            return res.json({
                isSuccess: true,
                message: `Success adding ${user_to_be_add.name}`,
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err,
            message: 'Something Went Wrong!',
        });
    }
};

exports.add_job_posting = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, title, salary_range, type, editor } = req.body;
            const { organization_id } = await Organization_Members.findOne({
                member_id: user._id,
            });
            const job_posting = new JobPostings({
                organization_id: organization_id,
                created_by: user._id,
                title: title,
                range: salary_range,
                type: type,
                editor: editor,
            });
            await job_posting.save();
            res.json({ isSuccess: true, message: 'Success Posting a Job' });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'Something went Wrong!.' });
    }
};

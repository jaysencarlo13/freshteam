const Organizations = require('../models/organization');
const Users = require('../models/user');
const Organization_Members = require('../models/organization_members');
const JobPostings = require('../models/job_postings');

exports.add_department = async (req, res, next) => {
  try {
    if (req.body) {
      const { department, user } = req.body;
      const thisuser = await Users.findById(user._id);
      const organization = await Organizations.findById(
        thisuser.work_info.organization_id
      );
      organization.departments = [
        ...organization.departments,
        { name: department },
      ];
      await organization.save();
      res.json({ message: 'Success Adding Department', isSuccess: true });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err, message: 'Something Went Wrong!' });
  }
};

exports.add_employee = async (req, res, next) => {
  try {
    if (req.body) {
      const { user, employee_email } = req.body;
      const thisuser = await Organization_Members.find({
        member_id: user._id,
      });
      const user_to_be_add = await Users.find({ email: employee_email });
      if (user_to_be_add.length === 0)
        return res.json({
          isSuccess: false,
          message:
            'User is not yet registered. Please make sure that the user is register before adding to your Organization. Thank you!',
        });

      if (
        user_to_be_add[0]._doc.work_info &&
        user_to_be_add[0]._doc.work_info.organization_id
      ) {
        const isAlreadyMember = await Organization_Members.find({
          organization_id: thisuser[0]._doc.organization_id,
          member_id: user_to_be_add[0]._doc._id,
        });
        if (isAlreadyMember !== 0)
          return res.json({
            isSuccess: false,
            message: 'User is already added to the organization.',
          });
        else
          return res.json({
            isSuccess: true,
            message: 'User is in different organization',
          });
      }

      user_to_be_add[0]._doc.work_info.organization_id =
        thisuser[0]._doc.organization_id;
      await user_to_be_add[0].save();
      const newuser = new Organization_Members({
        organization_id: thisuser[0]._doc.organization_id,
        member_id: user_to_be_add[0]._doc._id,
      });
      await newuser.save();
      return res.json({
        isSuccess: true,
        message: `Success adding ${user_to_be_add[0]._doc.name}`,
      });
    }
  } catch (err) {
    console.log(err);
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

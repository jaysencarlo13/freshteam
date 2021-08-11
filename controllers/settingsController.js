const Users = require('../models/user');
const moment = require('moment');
const Applicant = require('../models/applicant');
const Organization_Members = require('../models/organization_members');
const Organizations = require('../models/organization');
const { FilterArray } = require('../models/methods');

exports.settings = async (req, res, next) => {
    try {
        if (req.body) {
            let { user, search } = req.body;
            let array = [];
            search = search === '' ? undefined : search;
            const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
            const organization_members = await Organization_Members.find({ organization_id });
            const members = FilterArray(organization_members, 'member_id');
            const users = search
                ? await Users.find(
                      { _id: [...members], name: { $regex: search, $options: 'i' } },
                      '_id name user_type google.username'
                  ).sort({ name: 1 })
                : await Users.find({ _id: [...members] }, '_id name user_type google.username').sort({
                      name: 1,
                  });
            users.forEach(({ _id, name, google, user_type }) => {
                let { title, join_date, status } = organization_members.find(
                    (e) => e.member_id.toString() === _id.toString()
                );
                join_date = moment(join_date).format('MMMM DD, YYYY');
                array.push({
                    _id,
                    name,
                    email: google.username ? google.username : 'Google Not Yet Setup',
                    role: user_type,
                    title,
                    join_date,
                });
            });
            return res.json({ isSuccess: true, message: 'Success', table: array });
        }
    } catch (err) {
        if (err) {
            return res.status(500).json({ error: err, message: 'Something went wrong!' });
        }
    }
};

exports.update = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { id, role } = data;
            const thisuser = await Users.findById(user._id);
            thisuser.user_type = role;
            await thisuser.save();
            res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

const User = require('../models/user');
const moment = require('moment');
const Applicant = require('../models/applicant');

exports.postRegister = async (req, res, next) => {
    try {
        if (req.body) {
            const { name, email, birthdate, password } = req.body;

            const check_user = await User.find({ email });
            if (check_user.length !== 0)
                return res.status(500).json({
                    error: 'User is Already Registered',
                    message: 'User is Already Registered',
                });

            const check_applicant = await Applicant.find({ 'personal_info.email': email });
            if (check_applicant.length !== 0)
                return res.status(500).json({
                    error: 'User is already registered as applicant.',
                    message: 'User is already registered as applicant',
                });

            const user = new User({
                name: name,
                email: email,
                birthdate: moment(birthdate, 'YYYY-MM-DD'),
                password: password,
            });

            await user.save((err) => {
                if (err && err.code === 11000) {
                    return res.status(500).json({ error: err, message: 'User already exist!' });
                }
                return res.json({ success: true, message: 'Registration Success!' });
            });
        }
    } catch (err) {
        if (err) {
            return res.statusCode(500).json({ error: err, message: 'Something went wrong!' });
        }
    }
};

exports.applicantRegister = async (req, res, next) => {
    try {
        if (req.body) {
            const { name, email, birthdate, password } = req.body;

            const check_user = await User.find({ email });
            if (check_user.length !== 0)
                return res.status(500).json({
                    error: 'User is Already Registered as Employee',
                    message: 'User is Already Registered as Employee',
                });

            const check_applicant = await Applicant.find({ 'personal_info.email': email });
            if (check_applicant.length !== 0)
                return res.status(500).json({
                    error: 'User is already registered.',
                    message: 'User is already registered',
                });

            const user = new Applicant({
                'personal_info.name': name,
                'personal_info.email': email,
                'personal_info.birthdate': moment(birthdate, 'YYYY-MM-DD'),
                password: password,
            });

            await user.save((err) => {
                if (err && err.code === 11000) {
                    return res.status(500).json({ error: err, message: 'User already exist!' });
                }
                return res.json({ success: true, message: 'Registration Success!' });
            });
        }
    } catch (err) {
        if (err) {
            return res.statusCode(500).json({ error: err, message: 'Something went wrong!' });
        }
    }
};

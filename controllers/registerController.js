const User = require('../models/user');
const moment = require('moment');
const Applicant = require('../models/applicant');

exports.postRegister = async (req, res, next) => {
    try {
        if (req.body) {
            const { name, email, birthdate, password } = req.body;
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

            const check1 = await User.find({ email });

            if (check1.length !== 0)
                return res
                    .status(500)
                    .json({
                        message:
                            'User is already employed. To become an applicant, login in employee/employer and change the status to applicant',
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

const User = require('../models/user');
const moment = require('moment');

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
					console.log(err);
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

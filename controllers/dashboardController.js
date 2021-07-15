const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');

exports.getDashboard = async (req, res, next) => {
	res.json({ isAuthenticated: true });
};

exports.postDashboard = async (req, res, next) => {};

exports.getUser = async (req, res, next) => {
	try {
		const { user } = req.body;
		const _user = await User.findById(user._id);
		res.json({ user: _user });
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something went wrong' });
	}
};

exports.getLogout = async (req, res, next) => {
	try {
		const { sessionID } = req.body;
		if (sessionID) {
			req.logout();
			await Session.findByIdAndDelete(sessionID);
			res.json({ isLogout: true, message: 'Success' });
		}
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something went wrong!' });
	}
};

exports.updateUser = async (req, res, next) => {
	try {
		if (req.body) {
			const { personal_info, work_info, user } = req.body;
			await User.updateOne(
				{ _id: user._id },
				{
					...personal_info,
					work_info,
				}
			);
			res.json({ isUpdated: true, message: 'Success updating user' });
		}
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something went wrong!' });
	}
};

exports.changepassword = async (req, res, next) => {
	try {
		if (req.body) {
			const { password, newpassword, user } = req.body;
			const userthis = await User.findById(user._id);
			const isValid = await userthis.checkPassword(password);
			if (isValid) {
				userthis.password = newpassword;
				await userthis.save();
				res.json({ isChangePassword: true, message: 'Success Changing Password' });
			} else {
				res.json({ isChangePassword: false, message: 'Password Incorrect' });
			}
		}
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something went Wrong' });
	}
};

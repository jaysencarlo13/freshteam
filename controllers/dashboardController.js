const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');

exports.checkAuth = (req, res, next) => {
	if (req.body) {
		return res.json({ isAuthenticated: true });
	}
};

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

exports.getMyInterviews = async (req, res, next) => {
	try {
		if (req.body) {
			const { user } = req.body;
			const arrayToday = [];
			const arrayMissed = [];
			const arrayUpcoming = [];

			const users = await User.find();
			const myinterviews_today = await Interviews.find({ userId: user._id, date_time: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() } });
			const myinterviews_missed = await Interviews.find({ userId: user._id, date_time: { $lte: moment().startOf('day').toDate() } });
			const myinterviews_upcoming = await Interviews.find({ userId: user._id, date_time: { $gte: moment().startOf('day').toDate() } });
			const 

			if (myinterviews_today.length) {
				myinterviews_today.forEach((element) => {
					const userthis = users.find((e) => e._id === element.interviewee);
					const name = userthis.name;
					const email = userthis.email;
					const assignBy = users.find((e) => e._id === element.assignBy).name;
					const date_time = element.date_time;
					arrayToday.push({
						name: name,
						email: email,
						assignBy: assignBy,
						date_time: date_time,
					});
				});
			}
			if (myinterviews_missed.length) {
				myinterviews_missed.forEach((element) => {
					const userthis = users.find((e) => e._id === element.interviewee);
					const name = userthis.name;
					const email = userthis.email;
					const assignBy = users.find((e) => e._id === element.assignBy).name;
					const date_time = element.date_time;
					arrayMissed.push({
						name: name,
						email: email,
						assignBy: assignBy,
						date_time: date_time,
					});
				});
			}
			if (myinterviews_upcoming.length) {
				myinterviews_upcoming.forEach((element) => {
					const userthis = users.find((e) => e._id.toString() === element.interviewee.toString());
					const name = userthis.name;
					const email = userthis.email;
					const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString()).name;
					const date_time = element.date_time;
					arrayUpcoming.push({
						name: name,
						email: email,
						assignBy: assignBy,
						date_time: date_time,
					});
				});
			}
			res.json({ isSuccess: true, today: arrayToday, missed: arrayMissed, upcoming: arrayUpcoming });
		}
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

const User = require('../models/user');
const moment = require('moment');
const Session = require('../models/session');
const Interviews = require('../models/interviews');
const Applicants = require('../models/applicant');
const JobPostings = require('../models/job_postings');
const Organization_Members = require('../models/organization_members');
const Organizations = require('../models/organization');
const Candidates = require('../models/candidates');
const TalentPool = require('../models/talent_pool');
const Request = require('../models/request');
const { FilterArray } = require('../models/methods');
const nodemailer = require('nodemailer');

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
		const user_ = await User.findById(user._id);
		const { name, email, birthdate, home, contact } = user_;
		const organization_member = await Organization_Members.findOne({
			member_id: user._id,
		});
		if (organization_member) {
			const { employee_id, status, department, title, join_date } = organization_member;
			return res.json({
				user: {
					personal_info: {
						name,
						email,
						birthdate,
						home,
						contact,
					},
					work_info: {
						employee_id,
						status,
						department,
						title,
						join_date,
					},
				},
			});
		} else
			return res.json({
				user: {
					personal_info: {
						name,
						email,
						birthdate,
						home,
						contact,
					},
					work_info: {
						employee_id: '',
						status: '',
						department: '',
						title: '',
						join_date: '',
					},
				},
			});
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
			return res.json({ isLogout: true, message: 'Success' });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Something went wrong!' });
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
				}
			);
			await Organization_Members.findOneAndUpdate({ member_id: user._id }, { ...work_info });
			return res.json({ isUpdated: true, message: 'Success updating user' });
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
			const arrayReferrals = [];
			const arrayBirthdaycorner = [];
			const arrayNewJoinees = [];

			const messenger = await User.findById(user._id);

			const users = await User.find();
			const applicant = await Applicants.find();
			const job_postings = await JobPostings.find();
			const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
			const myinterviews_today = await Interviews.find({
				interviewer: user._id,
				date_time: { $gte: moment().startOf('day').toDate(), $lte: moment().endOf('day').toDate() },
			});
			const myinterviews_missed = await Interviews.find({
				interviewer: user._id,
				date_time: { $lt: moment().startOf('day').toDate() },
			});
			const myinterviews_upcoming = await Interviews.find({
				interviewer: user._id,
				date_time: { $gt: moment().startOf('day').toDate() },
			});
			const myReferrals_candidate = await Candidates.find({ referred_by: user._id });
			const myReferrals_talentpool = await TalentPool.find({ referred_by: user._id });
			const birthdayCorner = await User.aggregate([
				{
					$match: {
						$expr: {
							$and: [
								{
									$eq: [{ $month: '$birthdate' }, { $month: moment().toDate() }],
								},
								{
									$gte: [{ $dayOfMonth: '$birthdate' }, { $dayOfMonth: moment().toDate() }],
								},
								{
									$lte: [{ $dayOfMonth: '$birthdate' }, { $dayOfMonth: moment().endOf('month').toDate() }],
								},
							],
						},
					},
				},
				{
					$sort: {
						birthdate: 1,
					},
				},
			]);
			const newJoinees = await Organization_Members.find({
				organization_id,
				join_date: {
					$gte: moment().subtract(7, 'days').toDate(),
					$lte: moment().toDate(),
				},
			});

			if (myinterviews_today.length) {
				myinterviews_today.forEach((element) => {
					const userthis = applicant.find((e) => e._id.toString() === element.interviewee.toString());
					const name = userthis.personal_info.name;
					const email = userthis.personal_info.email;
					const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString());
					const date_time = element.date_time;
					arrayToday.push({
						id: element._id,
						name: name,
						email: email,
						assignBy: {
							id: assignBy._id,
							name: assignBy.name,
							email: assignBy.email,
						},
						date_time: date_time,
					});
				});
			}
			if (myinterviews_missed.length) {
				myinterviews_missed.forEach((element) => {
					const userthis = applicant.find((e) => e._id.toString() === element.interviewee.toString());
					const name = userthis.personal_info.name;
					const email = userthis.personal_info.email;
					const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString());
					const date_time = element.date_time;
					arrayMissed.push({
						id: element._id,
						name: name,
						email: email,
						assignBy: {
							id: assignBy._id,
							name: assignBy.name,
							email: assignBy.email,
						},
						date_time: date_time,
					});
				});
			}
			if (myinterviews_upcoming.length) {
				myinterviews_upcoming.forEach((element) => {
					const userthis = applicant.find((e) => e._id.toString() === element.interviewee.toString());
					const name = userthis.personal_info.name || '';
					const email = userthis.personal_info.email || '';
					const assignBy = users.find((e) => e._id.toString() === element.assignBy.toString());
					const date_time = element.date_time;
					arrayUpcoming.push({
						id: element._id,
						name: name,
						email: email,
						assignBy: {
							id: assignBy._id,
							name: assignBy.name,
							email: assignBy.email,
						},
						date_time: date_time,
					});
				});
			}
			if (myReferrals_candidate.length || myReferrals_talentpool.length) {
				if (myReferrals_candidate.length)
					myReferrals_candidate.forEach((element) => {
						const { applicant_id, date_applied, status, job_posting_id } = element;
						const { personal_info } = applicant.find((e) => e._id.toString() === applicant_id.toString());
						const { name, email } = personal_info;
						const { title } = job_postings.find((e) => e._id.toString() === job_posting_id.toString());
						arrayReferrals.push({
							name,
							email,
							applied_job: title ? `${title}/${status}` : 'Job is Unavailable',
							date_applied: moment(date_applied).format('MMMM DD, YYYY'),
						});
					});
				if (myReferrals_talentpool.length)
					myReferrals_talentpool.forEach((element) => {
						const { applicant_id, date_applied, status, job_posting_id } = element;
						const { personal_info } = applicant.find((e) => e._id.toString() === applicant_id.toString());
						const { name, email } = personal_info;
						const { title } = job_postings.find((e) => e._id.toString() === job_posting_id.toString());
						arrayReferrals.push({
							name,
							email,
							applied_job: title ? `${title}/${status}` : 'Job is Unavailable',
							date_applied: moment(date_applied).format('MMMM DD, YYYY'),
						});
					});
			}
			if (birthdayCorner.length) {
				birthdayCorner.forEach((element) => {
					const { name, birthdate } = element;
					arrayBirthdaycorner.push({
						name: name,
						birthdate: moment(birthdate).format('MMMM DD'),
					});
				});
			}
			if (newJoinees.length) {
				newJoinees.forEach(({ member_id, department, title, join_date }) => {
					const { name, email } = users.find((e) => e._id.toString() === member_id.toString());
					arrayNewJoinees.push({
						name,
						email,
						department,
						title,
						join_date: moment(join_date).format('MMMM DD, YYYY'),
					});
				});
			}
			return res.json({
				isSuccess: true,
				today: arrayToday,
				missed: arrayMissed,
				upcoming: arrayUpcoming,
				referrals: arrayReferrals,
				birthday_corner: arrayBirthdaycorner,
				new_joinees: arrayNewJoinees,
				messenger: {
					isGoogleSetup: messenger.google.username !== '' || messenger.google.password !== '' ? true : false,
					email: messenger.google.username,
				},
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

exports.updateGoogle = async (req, res, next) => {
	try {
		if (req.body) {
			const { user, google } = req.body;
			const { email, password } = google;
			const update_user = await User.findById(user._id);
			update_user.google.username = email;
			update_user.google.password = password;
			await update_user.save();
			res.json({ isSuccess: true, message: 'Success' });
		}
	} catch (err) {
		res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

exports.transfer = async (req, res, next) => {
	try {
		if (req.body) {
			const { user } = req.body;
			const { _id, name, email, birthdate, password, contact, home } = await User.findById(user._id);
			const applicant = new Applicants({
				personal_info: {
					name,
					birthdate,
					home,
					email,
					contact,
				},
				password,
				isTransfer: true,
			});
			await applicant.save();
			await Organization_Members.deleteMany({ member_id: _id });
			// await User.findByIdAndDelete(_id);
			await Request.deleteMany({ user_id: user._id });
			return res.json({
				isSuccess: true,
				message: 'Success Transfering this account to applicant. Please logout and login in applicants login page. Thank you',
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Transfering Failed. Something Went Wrong' });
	}
};

exports.admin_request = async (req, res, next) => {
	try {
		if (req.body) {
			const { user } = req.body;
			const request = new Request({
				user_id: user._id,
			});
			const request_ = await Request.find({ user_id: user._id });
			if (request_.length !== 0)
				return res.json({
					isSuccess: false,
					message: 'You already request. Please wait for decision',
				});
			await request.save();
			return res.json({
				isSuccess: true,
				message: 'Success Requesting to be an admin. Please wait for approval',
			});
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Request Failed. Something Went Wrong' });
	}
};

exports.superuser = async (req, res, next) => {
	try {
		if (req.body) {
			let array = [];
			const request = await Request.find({}).sort({ createdAt: -1 });
			const users_id = FilterArray(request, 'user_id');
			const users = await User.find({ _id: users_id });
			users.forEach(({ _id, name, email }) => {
				const request_ = request.find((element) => element.user_id.toString() === _id.toString());
				array.push({
					request_id: request_._id,
					user_id: _id,
					name,
					email,
					createdAt: moment(request_.createdAt).format('MMMM DD, YYYY hh:mm A'),
				});
			});
			return res.json({ isSuccess: true, table: array });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

exports.superuser_accept = async (req, res, next) => {
	try {
		if (req.body) {
			const { data } = req.body;
			const { request_id, user_id } = data;
			await User.findByIdAndUpdate(user_id, { user_type: 'admin_fresh' });
			await Request.deleteMany({ user_id });
			return res.json({ isSuccess: true, message: 'Success' });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Accept Failed. Something went wrong' });
	}
};

exports.superuser_reject = async (req, res, next) => {
	try {
		if (req.body) {
			const { data } = req.body;
			const { request_id, user_id } = data;
			await Request.deleteMany({ user_id });
			return res.json({ isSuccess: true, message: 'Success' });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Reject Failed. Something went wrong' });
	}
};

exports.admin_fresh = async (req, res, next) => {
	try {
		if (req.body) {
			const { user, data } = req.body;
			const { name, description, headquarters, industry } = data;
			const organization = new Organizations({
				created_by: user._id,
				name,
				description,
				headquarters,
				industry,
			});
			const organization_member = new Organization_Members({
				member_id: user._id,
				organization_id: organization._id,
			});
			await organization.save();
			await organization_member.save();
			await User.findByIdAndUpdate(user._id, { user_type: 'admin' });
			return res.json({ isSuccess: true, message: 'Success creating organization' });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

exports.organization_details = async (req, res, next) => {
	try {
		if (req.body) {
			const { user } = req.body;
			const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
			const users = await User.find();
			let organization = await Organizations.findById(organization_id);
			const created_by = users.find((element) => element._id.toString() === organization.created_by.toString()).name;
			return res.json({ isSuccess: true, organization: { ...organization._doc, created_by } });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

exports.organization_update = async (req, res, next) => {
	try {
		if (req.body) {
			const { user, update } = req.body;
			const { name, description, headquarters, industry, departments } = update;
			const { organization_id } = await Organization_Members.findOne({ member_id: user._id });
			await Organizations.findByIdAndUpdate(organization_id, {
				name,
				description,
				headquarters,
				industry,
				departments,
			});
			return res.json({ isSuccess: true, message: 'Success Updating your organization' });
		}
	} catch (err) {
		return res.status(500).json({ error: err, message: 'Update Failed. Something went wrong while updating' });
	}
};

exports.send_feedback = async (req, res, next) => {
	try {
		if (req.body) {
			const { user, message, data } = req.body;
			const { to, cc, from, subject, text, html } = message;
			const thisuser = await User.findById(user._id);
			const googlepassword = await thisuser.GooglePassword();
			let transporter = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
					user: thisuser.google.username,
					pass: googlepassword,
				},
				priority: 'high',
			});
			await transporter.sendMail({
				from: thisuser.google.username,
				to,
				cc,
				subject,
				text,
				html,
			});
			await Interviews.findByIdAndDelete(data.id);
			return res.json({ isSuccess: true, message: 'Success Providing Feedback' });
		}
	} catch (err) {
		if (err.responseCode === 535)
			return res.status(500).json({
				error: err,
				message: 'Google Username or Password is incorrect. Check and input your google account credentials.',
				responseCode: err.responseCode,
			});
		return res.status(500).json({ error: err, message: 'Something Went Wrong' });
	}
};

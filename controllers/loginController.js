const passport = require('passport');

exports.postLogin = async (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return res.status(500).json({ error: err, message: 'Something went wrong' });
		}

		if (!user) {
			return res.json(info);
		}

		req.logIn(user, (err) => {
			if (err) {
				return res.status(500).json({ error: err, message: 'Something went Wrong' });
			}
			const data = {
				user: { _id: req.user._id },
				sessionID: req.sessionID,
			};
			return res.json({ data: data, message: 'Success Loging In' });
		});
	})(req, res, next);
};

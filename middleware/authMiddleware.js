const Session = require('../models/session');
const authMiddleware = async (req, res, next) => {
	try {
		if (req.body) {
			const { user, sessionID } = req.body;
			req.user = user;
			req.sessionID = sessionID;
			const isValid = await check_sessionID(sessionID, user._id);
			if (req.isAuthenticated() && isValid) {
				return next();
			}
			return res.json({ redirect: '/login', isAuthenticated: false });
		}
	} catch {
		return res.json({ redirect: '/login', isAuthenticated: false });
	}
};
async function check_sessionID(sessionID, userID) {
	try {
		let session;
		if (sessionID) {
			session = await Session.find({ _id: sessionID });
		}
		if (session && session.length && userID) {
			if (JSON.parse(session[0]._doc.session).passport.user === userID) return true;
		}
		return false;
	} catch (err) {
		return false;
	}
}

module.exports = authMiddleware;

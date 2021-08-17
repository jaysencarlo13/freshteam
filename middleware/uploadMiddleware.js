const Session = require('../models/session');

const authUpload = async (req, res, next) => {
    try {
        const { user, sessionID } = req;
        const isValid = await check_sessionID(sessionID, user._id);
        if (req.isAuthenticated() && isValid) {
            return next();
        }
        return res.json({ redirect: '/login', isAuthenticated: false });
    } catch (err) {
        return res.json({ redirect: '/login', isAuthenticated: false });
    }
};

async function check_sessionID(sessionID, userID) {
    try {
        let session;
        if (sessionID) {
            session = await Session.find({ _id: sessionID });
        }
        if (session && session.length !== 0 && userID) {
            if (JSON.parse(session[0]._doc.session).passport.user === userID.toString()) return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}

module.exports = authUpload;

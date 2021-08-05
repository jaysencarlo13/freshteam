const passport = require('passport');

exports.postLogin = async (req, res, next) => {
    passport.authenticate('user', (err, user, info) => {
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
                user: { _id: req.user._id, usertype: req.user.user_type },
                sessionID: req.sessionID,
            };
            return res.json({ data: data, message: 'Success Loging In' });
        });
    })(req, res, next);
};

exports.applicantLogin = async (req, res, next) => {
    passport.authenticate('applicant', (err, user, info) => {
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
                user: { _id: req.user._id, usertype: 'applicant' },
                sessionID: req.sessionID,
            };
            return res.json({ data: data, message: 'Success Loging In' });
        });
    })(req, res, next);
};

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/user');
const Applicant = require('../../models/applicant');

passport.use(
    'user',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false, { message: 'User not found' });
                if (await user.checkPassword(password)) return done(null, user);
                return done(null, false, { message: 'Incorrect password' });
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.use(
    'applicant',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                const user = await Applicant.findOne({ 'personal_info.email': email });
                if (!user) return done(null, false, { message: 'User not found' });
                if (await user.checkPassword(password)) return done(null, user);
                return done(null, false, { message: 'Incorrect password' });
            } catch (e) {
                return done(e);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        const user = await User.findOne({ _id });
        if (user) return done(null, user);
        const applicant = await Applicant.findById(_id);
        if (applicant) return done(null, applicant);
    } catch (e) {
        return done(e);
    }
});

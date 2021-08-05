const Applicants = require('../models/applicant');

exports.fetch = async (req, res, next) => {
    try {
        if (req.body && req.body.user.usertype === 'applicant') {
            const { user } = req.body;
            const applicant = await Applicants.findById(
                user._id,
                '_id personal_info work_experience education skills certification_licenses additional_information file'
            );
            return res.json({ isSuccess: true, message: 'Success', applicant });
        }
    } catch (err) {
        res.status(500).json({ error: err, message: 'SOmething went Wrong' });
    }
};

exports.update = async (req, res, next) => {
    try {
    } catch (err) {
        res.status(500).json({ error: err, message: 'SOmething went Wrong' });
    }
};

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

exports.update_personal_info = async (req, res, next) => {
    try {
        if (req.body) {
            const { user: _user, update } = req.body;
            const { name, birthdate, home, email, contact } = update;
            let applicant = await Applicants.findById(_user._id);
            applicant.personal_info = { name, birthdate, home, email, contact };
            await applicant.save();
            return res.json({ isSuccess: true, message: 'Update Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'SOmething went Wrong' });
    }
};

exports.add_work_experience = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { job_title, company, address, currently_working, from, to, description } = data;
            let { work_experience } = await Applicants.findById(user._id);
            work_experience.push({
                job_title,
                company,
                address,
                time_period: { currently_working, from, to },
                description,
            });
            await Applicants.updateOne({ _id: user._id }, { work_experience });
            return res.json({ isSuccess: true, message: 'Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

exports.update_work_experience = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { id, job_title, company, address, time_period, description } = data;
            let { work_experience } = await Applicants.findById(user._id);
            const index = work_experience.findIndex((element) => element._id.toString() === id.toString());
            work_experience[index] = { job_title, company, address, time_period, description };
            await Applicants.updateOne({ _id: user._id }, { work_experience });
            return res.json({ isSuccess: true, message: 'Update Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Update Failed. Something Went Wrong' });
    }
};

exports.delete_work_experience = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id } = req.body;
            let { work_experience } = await Applicants.findById(user._id);
            const index = work_experience.findIndex((element) => element._id.toString() === id.toString());
            work_experience.splice(index, 1);
            await Applicants.findByIdAndUpdate(user._id, { work_experience });
            return res.json({ isSuccess: true, message: 'Delete Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Delete Failed. Something went wrong' });
    }
};

exports.add_education = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { education_level, field_study, school, location, currently_enrolled, from, to } = data;
            let { education } = await Applicants.findById(user._id);
            education.push({
                education_level,
                field_study,
                school,
                location,
                time_period: {
                    currently_enrolled,
                    from,
                    to,
                },
            });
            await Applicants.updateOne({ _id: user._id }, { education });
            return res.json({ isSuccess: true, message: 'Add Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Add Failed. Something Went Wrong' });
    }
};

exports.update_education = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { id, education_level, field_study, school, location, time_period } = data;
            let { education } = await Applicants.findById(user._id);
            const index = education.findIndex((element) => element._id.toString() === id.toString());
            education[index] = {
                education_level,
                field_study,
                school,
                location,
                time_period,
            };
            await Applicants.findByIdAndUpdate(user._id, { education });
            return res.json({ isSuccess: true, message: 'Update Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Update Failed. Something Went Wrong' });
    }
};

exports.delete_education = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id } = req.body;
            let { education } = await Applicants.findById(user._id);
            const index = education.findIndex((element) => element._id.toString() === id.toString());
            education.splice(index, 1);
            await Applicants.findByIdAndUpdate(user._id, { education });
            return res.json({ isSuccess: true, message: 'Delete Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Delete Failed. Something went wrong' });
    }
};

exports.add_skill = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { skill, years_of_experience } = data;
            let { skills } = await Applicants.findById(user._id);
            skills.push({
                skill,
                years_of_experience,
            });
            await Applicants.findByIdAndUpdate(user._id, { skills });
            return res.json({ isSuccess: true, message: 'Add Success' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err, message: 'Add Failed. Something went wrong' });
    }
};

exports.update_skill = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, data } = req.body;
            const { id, skill, years_of_experience } = data;
            let { skills } = await Applicants.findById(user._id);
            const index = skills.findIndex((element) => element._id.toString() === id.toString());
            skills[index] = { skill, years_of_experience };
            await Applicants.findByIdAndUpdate(user._id, { skills });
            return res.json({ isSuccess: true, message: 'Update Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Add Failed. Something went wrong' });
    }
};

exports.delete_skill = async (req, res, next) => {
    try {
        if (req.body) {
            const { user, id } = req.body;
            let { skills } = await Applicants.findById(user._id);
            const index = skills.findIndex((element) => element._id.toString() === id.toString());
            skills.splice(index, 1);
            await Applicants.findByIdAndUpdate(user._id, { skills });
            return res.json({ isSuccess: true, message: 'Delete Success' });
        }
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Delete Failed. Something went wrong' });
    }
};

exports.add_certification_licenses = async (req, res, next) => {
    try {
    } catch (err) {
        return res.status(500).json({ error: err, message: 'Something Went Wrong' });
    }
};

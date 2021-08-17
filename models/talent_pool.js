const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

const talentpoolSchema = new Schema(
    {
        job_posting_id: {
            type: Types.ObjectId,
            required: true,
        },
        applicant_id: {
            type: Types.ObjectId,
            required: true,
        },
        date_applied: {
            type: Date,
            default: moment(),
        },
        referred_by: {
            type: String,
            default: '',
        },
    },
    {
        collection: 'talentpool',
    }
);

module.exports = model('TalentPool', talentpoolSchema);

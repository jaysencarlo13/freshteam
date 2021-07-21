const { Schema, model, Types } = require('mongoose');

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
    },
    {
        collection: 'talentpool',
    }
);

module.exports = model('TalentPool', talentpoolSchema);

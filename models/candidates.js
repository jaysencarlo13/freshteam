const { Schema, model, Types } = require('mongoose');

const candidateSchema = new Schema(
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
        collection: 'candidates',
    }
);

module.exports = model('Candidates', candidateSchema);

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
        date_applied: {
            type: Date,
            required: true,
        },
        referred_by: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: 'Exam',
        },
    },
    {
        collection: 'candidates',
        timestamps: true,
    }
);

module.exports = model('Candidates', candidateSchema);

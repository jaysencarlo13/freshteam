const { Schema, Types, model } = require('mongoose');
const moment = require('moment');
const organization_history = new Schema(
    {
        organization_id: {
            type: Types.ObjectId,
            required: true,
        },
        rejected_candidates: {
            date: {
                type: Date,
            },
            rejected_by: {
                type: Types.ObjectId,
            },
        },
        job_postings: {
            date: {
                type: Date,
            },
            posted_by: {
                type: Types.ObjectId,
            },
        },
        hired: {
            date: {
                type: Date,
            },
            hired_by: {
                type: Types.ObjectId,
            },
        },
    },
    {
        collection: 'organization_history',
        timestamps: true,
    }
);

module.exports = model('Organization_History', organization_history);

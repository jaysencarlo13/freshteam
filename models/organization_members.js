const { Schema, Types, model } = require('mongoose');
const moment = require('moment');
const organization_members_schema = new Schema(
    {
        member_id: {
            type: Types.ObjectId,
            required: true,
        },
        organization_id: {
            type: Types.ObjectId,
            required: true,
        },
        employee_id: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: 'Active',
        },
        department: {
            type: String,
        },
        title: {
            type: String,
        },
        join_date: {
            type: Date,
            default: moment().toDate(),
        },
        timeoff: {
            type: Number,
            default: 12,
        },
    },
    {
        collection: 'organization_members',
    }
);

module.exports = model('Organization_Members', organization_members_schema);

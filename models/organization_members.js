const { Schema, Types, model } = require('mongoose');
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
        },
        status: {
            type: String,
        },
        department: {
            type: String,
        },
        title: {
            type: String,
        },
        join_date: {
            type: Date,
        },
    },
    {
        collection: 'organization_members',
    }
);

module.exports = model('Organization_Members', organization_members_schema);

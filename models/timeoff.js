const { Schema, model, Types } = require('mongoose');

const timeoff = new Schema(
    {
        organization_id: {
            type: Types.ObjectId,
            require: true,
        },
        member_id: {
            type: Types.ObjectId,
            require: true,
        },
        date: {
            type: Date,
            require: true,
        },
        status: {
            type: String,
            default: 'For Request',
        },
    },
    {
        collection: 'timeoff',
        timestamps: true,
    }
);

module.exports = model('Timeoff', timeoff);

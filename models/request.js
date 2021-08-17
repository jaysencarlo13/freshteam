const { Schema, Types, model } = require('mongoose');
const moment = require('moment');
const request = new Schema(
    {
        user_id: {
            type: Types.ObjectId,
            require: true,
        },
    },
    {
        collection: 'admin_request',
        timestamps: true,
    }
);

module.exports = model('Request', request);

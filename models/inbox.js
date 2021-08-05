const { Schema, Types, model } = require('mongoose');
const moment = require('moment');

const Inbox = new Schema(
    {
        _id: { type: String, required: true },
        to: [{ type: String, default: '' }],
        cc: [{ type: String, default: '' }],
        bcc: [{ type: String, default: '' }],
        from: {
            type: String,
            default: '',
        },
        subject: {
            type: String,
            default: '',
        },

        body: {
            text: {
                type: String,
            },
            html: {
                type: String,
            },
        },
        date: {
            type: Date,
            default: '',
        },
        name: {
            type: String,
            default: 'Unknown',
        },
    },
    {
        collection: 'inbox',
    }
);

module.exports = model('Inbox', Inbox);

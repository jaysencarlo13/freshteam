const { Schema, model } = require('mongoose');

const sessionSchema = new Schema(
	{
		_id: {
			type: String,
			required: true,
		},
		expires: {
			type: String,
		},
		session: {
			cookie: {
				type: Object,
			},
			passport: {
				user: {
					type: String,
				},
			},
		},
	},
	{
		collection: 'sessions',
	}
);
module.exports = model('Session', sessionSchema);

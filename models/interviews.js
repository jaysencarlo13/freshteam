const { Schema, model, Types } = require('mongoose');

const interviewSchema = new Schema(
	{
		interviewer: {
			type: Types.ObjectId,
			required: true,
		},
		interviewee: {
			type: Types.ObjectId,
			required: true,
		},
		assignBy: {
			type: Types.ObjectId,
			required: true,
		},
		date_time: {
			type: Date,
			required: true,
		},
		location: {
			type: String,
		},
	},
	{
		collection: 'interviews',
	}
);

module.exports = model('Interviews', interviewSchema);

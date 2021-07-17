const { Schema, model, Types } = require('mongoose');

const applicantSchema = new Schema(
	{
		referred_by: {
			type: Types.ObjectId,
			default: null,
		},
		assignBy: {
			type: Types.ObjectId,
			required: true,
		},
		date_time: {
			type: Date,
			required: true,
		},
	},
	{
		collection: 'referrals',
	}
);

module.exports = model('Referrals', referralsSchema);

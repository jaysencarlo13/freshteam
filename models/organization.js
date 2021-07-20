const { Schema, model, Types } = require('mongoose');

const organizationSchema = new Schema(
	{
		created_by: {
			type: Types.ObjectId,
			required: true,
		},
		name: {
			type: String,
		},
		description: {
			type: String,
		},
		headquarters: {
			type: String,
		},
		industry: {
			type: String,
		},
		departments: [
			{
				name: {
					type: String,
				},
			},
		],
	},
	{
		collection: 'organization',
	}
);

module.exports = model('Organizations', organizationSchema);

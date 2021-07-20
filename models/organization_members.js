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
	},
	{
		collection: 'organization_members',
	}
);

module.exports = model('Organization_Members', organization_members_schema);

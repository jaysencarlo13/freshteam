const { Types, Schema, model } = require('mongoose');

const job_postings_schema = new Schema(
	{
		organization_id: {
			type: Types.ObjectId,
		},
		created_by: {
			type: Types.ObjectId,
		},
		title: {
			type: String,
		},
		job_description: {
			type: String,
		},
	},
	{
		collection: 'job_postings',
	}
);

module.exports = model('job_postings_schema', job_postings_schema);

const { Schema, model, Types } = require('mongoose');

const applicantSchema = new Schema(
	{
		personal_info: {
			name: {
				type: String,
			},
			birthdate: {
				type: String,
			},
			home: {
				type: String,
			},
			email: {
				type: String,
				required: true,
			},
			contact: {
				type: String,
			},
		},
		work_experience: [
			{
				job_title: {
					type: String,
				},
				company: {
					type: String,
				},
				address: {
					type: String,
				},
				time_period: {
					currently_working: {
						type: Boolean,
					},
					from: {
						type: Date,
					},
					to: {
						type: Date,
					},
				},
				description: {
					type: String,
				},
			},
		],
		education: [
			{
				education_level: {
					type: String,
				},
				field_study: {
					type: String,
				},
				school: {
					type: String,
				},
				location: {
					type: String,
				},
				time_period: {
					currently_enrolled: {
						type: Boolean,
					},
					from: {
						type: Date,
					},
					to: {
						type: Date,
					},
				},
			},
		],
		skills: [
			{
				skill: {
					type: String,
				},
				years_of_experience: {
					type: Number,
				},
			},
		],
		certification_licenses: [
			{
				title: {
					type: String,
				},
				time_period: {
					does_expire: {
						type: Boolean,
					},
					from: {
						type: Date,
					},
					to: {
						type: Date,
					},
				},
			},
		],
		additional_information: {
			type: String,
		},
		file: {
			type: String,
		},
		job_applications: [
			{
				applied_job: {
					type: Types.ObjectId,
				},
				date_applied: {
					type: Date,
				},
				status: {
					type: String,
				},
				referred_by: {
					type: Types.ObjectId,
				},
			},
		],
	},
	{
		collection: 'applicant',
	}
);

module.exports = model('Applicants', applicantSchema);

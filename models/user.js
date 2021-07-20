const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	birthdate: {
		type: Date,
		required: false,
	},
	password: {
		type: String,
		required: true,
	},
	contact: {
		type: String,
	},
	home: {
		type: String,
	},
	work_info: {
		organization_id: {
			type: Types.ObjectId,
		},
		employee_status: {
			type: String,
		},
		employee_id: {
			type: String,
		},
		department: {
			type: String,
		},
		title: {
			type: String,
		},
		join_date: {
			type: Date,
		},
	},

	user_type: {
		is_admin: {
			type: Boolean,
			default: false,
		},
		is_manager: {
			type: Boolean,
			default: false,
		},
		is_hr: {
			type: Boolean,
			default: false,
		},
		is_employee: {
			type: Boolean,
			default: false,
		},
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) next();
	this.password = await bcrypt.hash(this.password, 15);
	return next();
});

userSchema.methods.checkPassword = async function (password) {
	const result = await bcrypt.compare(password, this.password);
	return result;
};

module.exports = model('Users', userSchema);

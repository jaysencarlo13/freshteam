const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcrypt');

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
            default: '',
        },
        file: {
            id: {
                type: String,
                default: '',
            },
            name: {
                type: String,
                default: '',
            },
        },
        password: {
            type: String,
            required: true,
        },
        isTransfer: {
            type: Boolean,
            default: false,
        },
    },
    {
        collection: 'applicant',
        timestamps: true,
    }
);

applicantSchema.pre('save', async function (next) {
    if (this.isTransfer) return next();
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 15);
    return next();
});

applicantSchema.post('save', async function (doc, next) {
    if (this.isTransfer) {
        doc.isTransfer = false;
        await doc.save();
    }
    return next();
});

applicantSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.password);
    return result;
};

module.exports = model('Applicants', applicantSchema);

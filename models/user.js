const { Schema, model, Types } = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { Buffer } = require('buffer');
const { secret } = require('../utils/config');

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

    user_type: {
        type: String,
        default: 'fresh',
    },
    google: {
        username: {
            type: String,
            default: '',
        },
        password: {
            type: String,
            default: '',
        },
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('google.password')) next();
    const iv = Buffer.from(secret, 'ascii').slice(0, 16);
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(secret, 'ascii').slice(32, 64);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = cipher.update(this.google.password, 'utf-8', 'hex') + cipher.final('hex');
    this.google.password = encrypted;
    return next();
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

userSchema.methods.GooglePassword = async function () {
    const iv = Buffer.from(secret, 'ascii').slice(0, 16);
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(secret, 'ascii').slice(32, 64);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = decipher.update(this.google.password, 'hex', 'utf-8') + decipher.final('utf-8');
    return decrypted;
};

module.exports = model('Users', userSchema);

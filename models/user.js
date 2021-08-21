const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const config = require('config');

const { goalSchema } = require('./goal');
const Constants = require('./constants');
const { number } = require('joi');

const Gender = {
    None: 0,
    Male: 1,
    Female: 2
};
Object.freeze(Gender);

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minlength: Constants.NAME_MIN_LENGTH,
        maxlength: Constants.NAME_MAX_LENGTH,
        trim: true,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        minlength: Constants.EMAIL_MIN_LENGTH, 
        maxlength: Constants.EMAIL_MAX_LENGTH,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    username: {
        type: String, 
        required: true,
        unique: true,
        minlength: Constants.USERNAME_MIN_LENGTH,
        maxlength: Constants.USERNAME_MAX_LENGTH,
        trim: true,
    },
    password: {
        type: String, 
        required: true, 
        minlength: Constants.PASSWORD_MIN_LENGTH,
        maxlength: Constants.PASSWORD_MAX_LENGTH,
    },
    registerDate: {
        type: Date,
        default: Date.now,
    },
    age: {
        type: Number,
        required: true,
        min: Constants.AGE_MIN_VALUE,
        max: Constants.AGE_MAX_VALUE,
    },
    height: {
        type: Number,
        required: true,
        min: Constants.HEIGHT_MIN_VALUE,
        max: Constants.HEIGHT_MAX_VALUE,
    },
    weight: {
        type: Number,
        required: true,
        min: Constants.WEIGHT_MIN_VALUE,
        max: Constants.WEIGHT_MAX_VALUE,
    },
    gender: {
        type: Number,
        enum: [Gender.None, Gender.Male, Gender.Female],
        required: true,
    },
    goal: goalSchema,
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({name: this.name, email: this.email, username: this.username}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

module.exports.User = User;
module.exports.userSchema = userSchema;
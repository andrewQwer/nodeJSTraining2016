var crypto = require('crypto');
var async = require('async');
var util = require('util');
var validate = require('mongoose-validator');
var mongoose = require('./../libs/mongoose'),
    Schema = mongoose.Schema;

var UserRoles = ['Anonymous', 'Registered', 'Administrator'];

var emailValidator = [
    validate({
        validator:"isEmail"
    })
]

var schema = new Schema({
    login: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        required: true,
        index: true,
        validate: emailValidator
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: UserRoles
    },
    lastLoginDate: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});


schema.methods.updateLastLoggedIn = function () {
    'use strict';
    this.update({lastLoginDate: new Date()}, function (err) {
        if (err) {
            log.error('Error updating last login date: ' + err.message);
        }
    });
};

schema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
};

schema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random() + '';
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

schema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.UserRoles = {
    Anonymous: UserRoles[0],
    Registered: UserRoles[1],
    Administrator: UserRoles[2]
};

exports.User = mongoose.model('User', schema);
var User = require('../models/user').User;
var AuthError = require('../error').AuthError;
var log = require('../libs/log')(module);
var sanitize = require('validator');
var async = require('async');

module.exports = function () {
    'use strict';

    /*
     * Performs escaping and trimming of passed values
     * */
    function escape(value) {
        return sanitize.escape(value).trim();
    }

    /*
     * Authorizes user by username and password
     * */
    function authorize(username, password, callback) {
        username = escape(username).toLowerCase();
        async.waterfall([
                function (callback) {
                    User.findOne({login: username}, callback);
                },
                function (user, callback) {
                    if (user) {
                        return callback(null, user);
                    }
                    User.findOne({email: username}, callback);
                },
                function (user, callback) {
                    if (user) {
                        if (user.checkPassword(password)) {
                            if (user.isBlocked) {
                                return callback(new AuthError('Your account is blocked'));
                            }
                            callback(null, user);
                        } else {
                            callback(new AuthError("Incorrect credentials"));
                        }
                    } else {
                        callback(new AuthError("Incorrect credentials"));
                    }
                }
            ],
            function (err, user) {
                if (err) {
                    if (err instanceof AuthError) {
                        return callback(err);
                    }
                    callback(new AuthError('Some error occured during registration'));
                    log.error(err);
                    return;
                }
                callback(null, user);
                user.updateLastLoggedIn();
            });
    }

    /*
     * Simple user registration method.
     */
    function register(login, pass, email, callback) {
        login = escape(login);
        email = escape(email).toLowerCase();
        var searchLogin = login.toLowerCase();
        async.waterfall([
                function (callback) {
                    User.findOne({login: searchLogin}, callback);
                },
                function (user, callback) {
                    if (user) {
                        return callback(new AuthError('User with the same login already exists'));
                    }
                    User.findOne({email: email}, callback);
                },
                function (user, callback) {
                    if (user) {
                        return callback(new AuthError('User with the same email already exists'));
                    }
                    var newUser = new User({
                        login: login,
                        email: email,
                        role: User.UserRoles.Registered,
                        password: pass
                    });
                    newUser.save(callback);
                }],
            function (err, user) {
                if (err) {
                    if (err instanceof AuthError) {
                        return callback(err);
                    }
                    callback(new AuthError('Some error occured during registration'));
                    log.error(err.toString());
                    return;
                }
                callback(null, user);
            });
    }

    function getUser(userId, callback) {
        User.findById(userId, callback);
    }

    return {
        authorize: authorize,
        register: register,
        getUser: getUser
    };
}

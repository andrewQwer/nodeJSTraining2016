var mongoose = require('./libs/mongoose');
var async = require('async');

var User = require('./models/user').User;
var Roles = User.UserRoles;

var u = ['test', 'moderator', 'admin'];
var userIds = [];

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers
], function (err) {
    console.log(arguments[0]);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

function open(callback){
    mongoose.connection.on('open', callback);
}

function dropDatabase(callback){
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}

function requireModels(callback){
    require('./models/user');

    async.each(Object.keys(mongoose.models), function(modelName, callback){
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    'use strict';
    var user1 = new User({
        login: u[0],
        password: "123",
        email: 'test@test.com',
        role: Roles.Registered
    }), user2 = new User({
        login: u[1],
        password: "123",
        email: 'moderator@test.com',
        role: Roles.Registered
    }), user3 = new User({
        login: u[2],
        password: "123",
        email: 'admin@test.com',
        role: Roles.Administrator
    }), users = [user1, user2, user3];
    async.each(users, function (userData, callback) {
        userData.save(function (err, user) {
            if (err) {
                return callback(err);
            }
            userIds.push(user._id);
            callback(null, user);
        });
    }, callback);
}

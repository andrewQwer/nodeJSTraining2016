var cookie = require('cookie');
var config = require('./../config');
var connect = require('connect');
var cookieParser = require('socket.io-cookie-parser');
var sessionStore = require('./../libs/sessionStore');
var async = require('async');
var HttpError = require('../error').HttpError;
var User = require('../models/user').User;

function LoadSession(sid, callback) {
    sessionStore.load(sid, function (err, session) {
        if (arguments.length == 0) {
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });
}

function LoadUser(session, callback) {
    if (!session.user) {
        console.log('Session %s is anonymous', session.id);
        return callback(null, null);
    }

    User.findById(session.user, function (err, user) {
        if (err) return callback(err);
        console.log('session: ' + session)

        if (!user) {
            return callback(null, null);
        }
        console.log(user);
        callback(null, user);
    })
}

module.exports = function (server) {
    var io = require('socket.io').listen(server);
    io.set('origins', 'localhost:*');
    io.use(cookieParser(config.get('session:secret')));
    io.use(authorization);

    function authorization(socket, callback) {
        async.waterfall([
            function (callback) {
                var sid = socket.request.signedCookies['connect.' + config.get('session:key')];
                console.log('auth sid ' + sid)

                LoadSession(sid, callback)
            },
            function (session, callback) {
                if (!session) {
                    return callback(new HttpError(401, 'No session'));
                }
                socket.handshake.session = session;
                LoadUser(session, callback);
            },
            function (user, callback) {
                if (!user) {
                    return callback(new HttpError(403, 'Anonymous session may not connect'));
                }
                socket.handshake.user = user;
                callback(null);
            }
        ], function (err) {
            if (!err) {
                return callback(null, true);
            }

            if (err instanceof HttpError) {
                return callback(null, false);
            }

            callback(err);
        });
    }

    io.sockets.on('session:reload', function (sid) {
        console.log('sid: ' + sid)
    })

    io.sockets.on('connection', function (socket) {

        var username = socket.handshake.user.get('username');

        socket.broadcast.emit('join', username);

        socket.on('message', function (text, cb) {
            socket.broadcast.emit('message', username, text);
            cb && cb();
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username);
        });
    });

    return io;
};
var mongoose = require('./mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var sessionStore = new MongoStore({mongooseConnection: mongoose.connections[0]});

module.exports = sessionStore;

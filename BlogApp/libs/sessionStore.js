var config = require('./../config');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

module.exports = new MongoStore({
    url: config.get('mongoose:uri'),
    autoRemove: 'native'
});
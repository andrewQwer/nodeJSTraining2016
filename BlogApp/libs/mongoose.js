var mongoose = require('mongoose');
var config = require('../config');
var log = require('../libs/log')(module);
var ENV = process.env.NODE_ENV;
var dbURI = config.get('mongoose:' + ENV + ':uri');
console.log(dbURI);
var dbOptions = config.get('mongoose:options');

mongoose.connect(dbURI, dbOptions);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    'use strict';
    log.info('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    'use strict';
    log.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    'use strict';
    log.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    'use strict';
    mongoose.connection.close(function () {
        log.info('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = mongoose;

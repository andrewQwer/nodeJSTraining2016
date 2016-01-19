var HttpError = require('../error').HttpError;

//restricts access for authorized users
module.exports = function (req, res, next) {
    'use strict';
    if (req.session.user) {
        return next(new HttpError(401));
    }
    next();
};
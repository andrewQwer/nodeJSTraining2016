var util = require('util');
var http = require('http');
/** HttpError **/

function HttpError(status, message) {
    'use strict';
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "HttpError";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';
/****************************/

/** Authentication error **/
function AuthError(message) {
    'use strict';
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message || "AuthError";
}

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';
/************************************/

exports.HttpError = HttpError;
exports.AuthError = AuthError;


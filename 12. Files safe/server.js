var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var ROOT = path.normalize(__dirname + '/public');

http.createServer(function (req, res) {
    if (!checkAccess(req)) {
        res.statusCode = 401;
        res.end('Tell me the secret to access');
        return;
    }
    sendFileSafe(url.parse(req.url).pathname, res);
}).listen(3000);

function checkAccess(req) {
    var urlParsed = url.parse(req.url, true);

    return !urlParsed.query
        ? false
        : urlParsed.query.secret == 'secret_here';
}

function badRequest(res) {
    res.statusCode = 400;
    res.end('Bad request');
    return;
}

function notFound(res) {
    res.statusCode = 404;
    res.end('File not found');
    return;
}

function sendFileSafe(filePath, res) {

    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        return badRequest(res);
    }

    if (filePath.indexOf('\0')) {
        return badRequest(res);
    }

    filePath = path.normalize(path.join(ROOT, filePath));

    if (filePath.indexOf(ROOT) != 0) {
        return notFound(res);
    }

    fs.stat(filePath, function (err, stats) {
        if (err || !stats.isFile()) {
            return notFound(res);
        }

        sendFile(filePath, res);
    })
}

function sendFile(filePath, res) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            throw err;
        }

        var mime = require('mime').lookup(filePath);
        res.setHeader('Content-Type', mime + '; charset=utf-8');
        res.end(content);
    });
}
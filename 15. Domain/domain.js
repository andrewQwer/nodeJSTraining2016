var domain = require('domain');
var fs = require('fs');
var http = require('http');

var d = domain.create(),
    server;

d.on('error', function (err) {
    console.error('Домен перехватил: %s', err);
});

server = new http.Server();

d.run(function () {
    d.add(server);
});

server.on('boom', function () {
    setTimeout(function () {
        fs.readFile(__filename, function () {
            ERR();
        });
    }, 1000)
});

server.emit('boom');
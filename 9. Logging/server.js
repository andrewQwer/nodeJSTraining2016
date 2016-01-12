var http = require('http');
var log = require('./log')(module);

var server = new http.createServer();

server.on('request', require('./app'));

server.listen(1337);

log.debug('Server is running');
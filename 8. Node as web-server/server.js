var http = require('http');

var server = new http.Server(); //http.Server: net.Server: EventEmitter

server.listen(1337, 'localhost');

var counter = 0;
var emit = server.emit;

server.emit = function(event){
    emit.apply(server, arguments);
    console.log(event);
};

server.on('request', function(req, res){
    res.end("Hello, world! " + counter++);
});
var http = require('http');

var server = new http.Server(function(req, res){
    console.log(req.headers);
    res.writeHead(200, 'OK', { 'Cache-control': 'no-cache' });
    res.end();
});

server.listen(1337, 'localhost');
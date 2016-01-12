var url = require('url');
var http = require('http');

var server = new http.Server(function (req, res) {
    
    var urlParsed = url.parse(req.url, true);

    if (urlParsed.pathname == '/echo' && urlParsed.query.message) {
        res.end(urlParsed.query.message);
    } else {
        res.statusCode = 404;
        res.end("Not found");
    }
});

server.listen(1337, 'localhost');
var http = require('http');
var fs = require('fs');
var path = require('path')

function sendFile(file, res) {

    file.pipe(res);

    file.on('error', function(err){
        res.statusCode = 500;
        res.end('Server Error');
        console.log(err);
    });

    file.on('open', function(){
        console.log('open');
    });

    file.on('close', function(){
        console.log('close');
    });

    res.on('close', function(){
        file.destroy();
    });
}
new http.Server(function(req, res){
    if(req.url == '/big.html'){
        var file = new fs.ReadStream(path.normalize(__dirname + '/big.html'));
        sendFile(file, res);
    }
}).listen(3000);
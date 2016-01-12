var http = require('http');

var server = new http.createServer(function(req, res){
   //some action here
}).listen(3000);

setTimeout(function(){
    server.close();
}, 2500);

var timer = setInterval(function(){
    console.log(process.memoryUsage())
}, 1000);

timer.unref();
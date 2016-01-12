var fs = require('fs');

fs.open('server.js', 'r', function(err, file){
    console.log('IO')
});

setImmediate(function(){
    console.log('immediate');
});

setTimeout(function(){
    console.log('timeout');
}, 0);

process.nextTick(function(){
    console.log('nexttick');
});
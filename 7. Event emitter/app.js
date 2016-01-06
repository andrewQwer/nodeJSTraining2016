var EventEmitter = require('events').EventEmitter;

var event = new EventEmitter();

event.on('request', function (request) {
    request.approved = true;
});

event.on('request', function (request) {
    console.log(request);
});

event.emit('request', {event_data: "hello"});
event.emit('request', {event_data: "world"});

even.on('error', function (err) {
    //..
});

server.emit('error', new Error('some error'));

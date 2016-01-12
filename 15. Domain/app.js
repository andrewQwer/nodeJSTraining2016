var domain = require('domain');
var serverDomain = domain.create();

var server = require('./server');

serverDomain.on('error', function (err) {
    console.error('Домен перехватил: %s', err);
});
serverDomain.add(server);

serverDomain.run(function () {
    server.listen(3000);
});
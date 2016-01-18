var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    var io = req.app.get('io');
    req.session.destroy(function () {
        io.sockets.emit('session:reload');
        res.redirect('/')
    });
});

module.exports = router;

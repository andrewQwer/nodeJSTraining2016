var UserDAO = require('../DAL/userDao');

exports.get = function (req, res, next) {
    'use strict';
    res.render('profile');
};

exports.post = function (req, res, next) {
    'use strict';
    var email = req.body.email;
    var userId = req.user._id;
    var dal = new UserDAO();
    dal.updateProfile(userId,email, function (err, data) {
        if (err) {
            return next(err);
        }
        res.redirect('/profile')
    });
};

exports.delete = function (req, res, next) {
    'use strict';
    var userId = req.user._id;
    var dal = new UserDAO();
    dal.deleteProfile(userId, function (err, data) {
        if (err){
            return next(err);
        }
        var io = req.app.get('io');
        req.session.destroy(function () {
            io.sockets.emit('session:reload');
            res.redirect('/')
        });
    });
}

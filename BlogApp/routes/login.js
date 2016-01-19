var UserDAO = require('../DAL/userDao');

exports.get = function (req, res, next){
    res.render('login');
}

exports.post = function (req, res, next) {
    'use strict';
    var username = req.body.username,
        password = req.body.password;

    var dal = new UserDAO();
    dal.authorize(username, password, function (err, user) {
        if (err) {
            return next(err);
        }
        req.session.user = user._id;
        res.redirect('/');
    });
}

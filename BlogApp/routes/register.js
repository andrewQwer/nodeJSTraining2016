var UserDAO = require('../DAL/userDao');

exports.get = function(req, res, next) {
    res.render('register');
};

exports.post = function (req, res, next) {
    var login = req.body.login,
        email = req.body.email,
        pass = req.body.password;
    var dal = new UserDAO();
    dal.register(login, pass, email, function (err, user) {
        if (err) {
            return next(err);
        }
        req.session.user = user._id;
        res.redirect('/');
    });
};

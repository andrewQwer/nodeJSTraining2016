var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var HttpError = require('./error').HttpError;
var config = require("./config");
var routes = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var logout = require('./routes/logout');
var chat = require('./routes/chat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
  secret: config.get('session:secret'),
  saveUninitialized: false,
  resave: false,
  key: config.get('session:sid'),
  cookie: config.get('session:cookie'),
  store: new MongoStore({
      url: config.get('mongoose:uri'),
      autoRemove: 'native'
    })
})); //connect.sid

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/chat', chat);
app.use('/login', login);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    if (typeof err == 'number')
      err = new HttpError(err);
    if (err instanceof HttpError){
      res.sendHttpError(err);
    } else {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    }
});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {

  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

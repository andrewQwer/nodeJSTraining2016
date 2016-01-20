var express = require('express');
var checkUnauth = require('../middleware/checkUnauth');
var checkAuth = require('../middleware/checkAuth');
var router = express.Router();

module.exports = function (app) {
  'use strict';
  app.get('/', require('./root').get);

  /** account routes */
  app.get('/login', checkUnauth, require('./login').get);
  app.post('/login', checkUnauth, require('./login').post);
  app.post('/logout', checkAuth, require('./logout').post);
  app.get('/register', checkUnauth, require('./register').get);
  app.post('/register', checkUnauth, require('./register').post);

  /** applications **/
  app.get('/chat', checkAuth, require('./chat').get);
  app.get('/profile', checkAuth, require('./profile').get);
  app.post('/profile/delete', checkAuth, require('./profile').delete);

};
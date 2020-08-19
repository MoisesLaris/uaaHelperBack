'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/home', UserController.home);
api.post('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/newUser', UserController.newUser);
api.post('/login', UserController.loginUser);

module.exports = api;
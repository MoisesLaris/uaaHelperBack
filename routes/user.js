'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.get('/home', UserController.home);
api.post('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/usuario/newUser', UserController.newUser);
api.post('/usuario/login', UserController.loginUser);
api.get('/usuario/getUsuarios', UserController.getAllUsers);
api.get('/usuario/getUsuario/:id', UserController.getUserById);

module.exports = api;
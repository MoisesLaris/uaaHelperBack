'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users' });

api.get('/home', UserController.home);
api.post('/pruebas', md_auth.ensureAuth, UserController.pruebas);
api.post('/usuario/newUser', UserController.newUser);
api.post('/usuario/newUserAdmin', md_auth.ensureAuth, UserController.newUserAdmin);
api.post('/usuario/editUser', UserController.editUser); //Funcion para editar usuario
api.post('/usuario/login', UserController.loginUser);
api.post('/usuario/uploadImage/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.post('/usuario/verifySession', UserController.verifySession);

api.get('/usuario/getUsuarios', UserController.getAllUsers);
api.get('/usuario/getUsuario/:id', UserController.getUserById);
api.get('/usuario/getImage/:imageFile', UserController.getProfileImage);

module.exports = api;
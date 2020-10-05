'use strict'

var express = require('express');
var publicacionController = require('../controllers/publicacion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');


var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/post' });


api.post('/publicacion/uploadImage', [md_auth.ensureAuth, md_upload], publicacionController.uploadImage);


api.post('/publicacion/newPublicacion', md_auth.ensureAuth, publicacionController.newPublication);
api.post('/publicacion/editarPublicacion', md_auth.ensureAuth, publicacionController.editarPost);
api.post('/publicacion/eliminarPublicacion', md_auth.ensureAuth, publicacionController.deletePost);

api.post('/publicacion/likePost', md_auth.ensureAuth, publicacionController.likePost);

api.get('/publicacion/preguntas/:page?', md_auth.ensureAuth, publicacionController.getQuestions);
api.get('/publicacion/preguntasFavoritas/:page?', md_auth.ensureAuth, publicacionController.getFavoriteQuestions);
api.get('/publicacion/misPreguntas/:page?', md_auth.ensureAuth, publicacionController.getMyQuestions);

api.get('/publicacion/publicaciones/:page?', md_auth.ensureAuth, publicacionController.getPosts);


api.get('/publicacion/getImage/:imageFile', publicacionController.getPostImage);


module.exports = api;
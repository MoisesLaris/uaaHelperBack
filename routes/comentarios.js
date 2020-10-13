'use strict'

var express = require('express');
var comentariosController = require('../controllers/comentarios');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/comentarios/newComentario', md_auth.ensureAuth, comentariosController.postComment);
api.post('/comentarios/deleteComentario', md_auth.ensureAuth, comentariosController.deleteComment);
api.get('/comentarios/idPost/:idPost/page/:page?', md_auth.ensureAuth, comentariosController.getComments);




module.exports = api;
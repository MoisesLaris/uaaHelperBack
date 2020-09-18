'use strict'

var express = require('express');
var publicacionController = require('../controllers/publicacion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/publicacion/newPublicacion', md_auth.ensureAuth, publicacionController.newPublication);
api.get('/publicacion/preguntas/:page?', /* md_auth.ensureAuth, */ publicacionController.getQuestions);



module.exports = api;
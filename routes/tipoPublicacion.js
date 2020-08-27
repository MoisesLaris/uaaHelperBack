'use strict'

var express = require('express');
var tipoController = require('../controllers/tipoPublicacion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/tipo/newTipo', tipoController.newTipo);
api.post('/tipo/editTipo', tipoController.editTipo);
api.post('/tipo/deleteTipo', tipoController.deleteTipo);


module.exports = api;
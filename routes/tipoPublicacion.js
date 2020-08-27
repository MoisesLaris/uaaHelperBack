'use strict'

var express = require('express');
var TipoController = require('../controllers/tipoPublicacion');

var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/tipo/newTipo', TipoController.newTipo);


module.exports = api;
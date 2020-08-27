'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar rutas
var user_routes = require('./routes/user');
var tipo_routes = require('./routes/tipoPublicacion')

//middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//cors

//rutas
app.use('/api', user_routes);
app.use('/api', tipo_routes);

//Exportar

module.exports = app;
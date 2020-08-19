'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSquema = Schema({
    nombre: String,
    apellidos: String,
    email: String,
    password: String,
});

module.exports = mongoose.model('User', UserSquema, "usuario");
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSquema = Schema({
    nombre: { type: String },
    apellidos: { type: String },
    email: { type: String },
    password: { type: String },
    isAdmin: { type: Boolean }
});

module.exports = mongoose.model('User', UserSquema, "usuario");
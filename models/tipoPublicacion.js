'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TipoSchema = Schema({
    nombre: { type: String },
});

module.exports = mongoose.model('Tipo', TipoSchema, "tipoPublicacion");
'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentariosSchema = Schema({
    idPublicacion: { type: Schema.ObjectId, ref: 'Publicacion' },
    nombre: { type: String },
});

module.exports = mongoose.model('Comentario', ComentariosSchema, "comentario");
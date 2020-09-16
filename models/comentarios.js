'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ComentariosSchema = Schema({
    idUser: { type: Schema.ObjectId, ref: 'User' },
    idPublicacion: { type: Schema.ObjectId, ref: 'Publicacion' },
    text: { type: String },
});

module.exports = mongoose.model('Comentario', ComentariosSchema, "comentario");
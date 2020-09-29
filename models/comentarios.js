'use strict'

var mongoose = require('mongoose');
var Publicacion = require('./publicacion');
var User = require('./user');
var Schema = mongoose.Schema;

var ComentariosSchema = Schema({
    idUser: { type: Schema.ObjectId, ref: 'User' },
    idPublicacion: { type: Schema.ObjectId, ref: 'Publicacion' },
    comentario: { type: String },
    fecha: { type: Date },
});

module.exports = mongoose.model('Comentario', ComentariosSchema, "comentarios");
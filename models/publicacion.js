'use strict'

var Tipo = require('./tipoPublicacion');
var User = require('./user');
var Comentario = require('./comentarios');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicacionSchema = Schema({
    titulo: { type: String },
    mensaje: { type: String },
    idUser: { type: Schema.ObjectId, ref: 'User' },
    tipoPublicacion: { type: Schema.ObjectId, ref: 'Tipo' },
    users: [{ type: Schema.ObjectId, ref: 'User' }],
    comentarios: [Comentario.schema],
    isQuestion: { type: Boolean },
    image: { type: String }
});

module.exports = mongoose.model('Publicacion', PublicacionSchema, "publicacion");
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
    idTipo: { type: Schema.ObjectId, ref: 'Tipo' },
    users: [User.schema],
    comentarios: [Comentario.schema]
});

module.exports = mongoose.model('Publicacion', PublicacionSchema, "publicacion");
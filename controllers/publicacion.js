'use strict'

var Tipo = require('../models/tipoPublicacion');
var Publicacion = require('../models/publicacion');
var mongoosePaginate = require('mongoose-pagination');

function newPublication(req, res) {
    var params = req.body;
    console.log(params);
    if (params.titulo && params.mensaje && 'isQuestion' in params) {
        var publicacion = new Publicacion();
        publicacion.titulo = params.titulo;
        publicacion.mensaje = params.mensaje;
        publicacion.isQuestion = params.isQuestion;

        publicacion.idUser = req.user.sub;
        if (req.user.isAdmin) {
            if (!params.isQuestion) {
                publicacion.tipoPublicacion = null;
            } else {
                if (!params.tipoPublicacion) return res.status(200).send({ message: 'Se debe mandar el tipo publicacion', success: false });
                if (!params.tipoPublicacion.id) return res.status(200).send({ message: 'Error al asignar publicacion a tipo publicacion', success: false });
                publicacion.tipoPublicacion = params.tipoPublicacion.id;
            }
        } else {
            publicacion.tipoPublicacion = null;
        }
        publicacion.save((err, publicacionStored) => {
            console.log(err);
            if (err) return res.status(200).send({ success: false, message: 'Error al guardar publicacion' });
            if (!publicacionStored) return res.status(200).send({ message: 'No se ha guardado la publicación', success: false });
            return res.status(200).send({ message: 'Publicación guardada exitosamente', success: true });
        });
    } else {
        return res.status(200).send({ message: 'Todos los campos son requeridos', success: false });
    }
}

function getQuestions(req, res) {

    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    Publicacion.find().sort('_id').paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer preguntas' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay preguntas' });
        return res.status(200).send({
            questions,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}




module.exports = {
    newPublication,
    getQuestions
}
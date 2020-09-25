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
        publicacion.fecha = new Date();

        publicacion.idUser = req.user.sub;
        if (req.user.isAdmin) {
            if (params.isQuestion) {
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
    var itemsPerPage = 12;

    Publicacion.find({ isQuestion: true }).sort('_id').populate('idUser').paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer preguntas' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay preguntas' });
        return res.status(200).send({
            questions,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function likePost(req, res) {
    var params = req.body;

    var conditionsIfNot = {
        _id: params.id,
        'users': { $ne: req.user.sub }
    };
    var updateIfNot = {
        $addToSet: { users: req.user.sub }
    }
    Publicacion.findOneAndUpdate(conditionsIfNot, updateIfNot, { new: true }, function(err, publicacionNot) {
        if (err) return res.status(500).send('error');
        if (publicacionNot) return res.status(200).send({ message: 'like removed', success: true, id: true });
        else {
            Publicacion.findOneAndUpdate({ _id: params.id, 'users': req.user.sub }, { $pull: { users: req.user.sub } }, { new: true }, (err, publicacionYes) => {
                if (err) return res.status(500).send('error');
                if (publicacionYes) return res.status(200).send({ message: 'like removed', success: true, id: false });
                else {
                    return res.status(500).send('error');
                }
            });
        }

    });

}




module.exports = {
    newPublication,
    getQuestions,
    likePost
}
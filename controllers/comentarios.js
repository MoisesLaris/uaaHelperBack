'use strict'

var Comentarios = require('../models/comentarios');
var mongoosePaginate = require('mongoose-pagination');
const { param } = require('../routes/publicacion');

function getComments(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 5;

    Comentarios.find({ idPublicacion: req.params.idPost }).sort('_id').populate('idUser').paginate(page, itemsPerPage, (err, comments, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer preguntas' });
        if (!comments) res.status(500).send({ success: false, message: 'No hay preguntas' });
        return res.status(200).send({
            comments,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function postComment(req, res) {
    var params = req.body;
    var idUsuario = req.user.sub;
    if (params.comentario && params.idPublicacion) {
        var comentario = new Comentarios();
        comentario.comentario = params.comentario;
        comentario.idUser = idUsuario;
        comentario.idPublicacion = params.idPublicacion;
        comentario.fecha = new Date();

        comentario.save((err, comentarioStored) => {
            console.log(err);
            if (err) return res.status(200).send({ success: false, message: 'Error al guardar publicacion' });
            if (!comentarioStored) return res.status(200).send({ message: 'No se ha guardado la publicación', success: false });
            return res.status(200).send({ message: 'Comentario guardado exitosamente', success: true, id: comentarioStored });
        });
    } else {
        return res.status(200).send({ message: 'Todos los campos son requeridos', success: false });
    }

}

module.exports = {
    getComments,
    postComment
}
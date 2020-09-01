'use strict'

var Tipo = require('../models/tipoPublicacion');
var Publicacion = require('../models/publicacion');

async function newPublication(req, res) {
    var params = req.body;
    if (params.titulo && params.mensaje) {
        var publicacion = new Publicacion();
        publicacion.titulo = params.titulo;
        publicacion.mensaje = params.mensaje;


        publicacion.idUser = req.user.sub;
        if (req.user.isAdmin) {
            if (!params.tipoPublicacion) return res.status(200).send({ message: 'Se debe mandar el tipo publicacion', success: false });
            if (params.tipoPublicacion.id) return res.status(200).send({ message: 'Error al asignar publicacion a tipo publicacion', success: false });
            publicacion.tipoPublicacion = params.tipoPublicacion.id;
        } else {
            //Se guarda el tipo como "pregunta"
            var tipoPregunta = await getTipoPregunta();
            publicacion.tipoPublicacion = tipoPregunta._id;
        }
        publicacion.save((err, publicacionStored) => {
            console.log(err);
            if (err) return res.status(200).send({ success: false, message: 'Error al guardar publicacion' });
            if (!publicacionStored) return res.status(200).send({ message: 'No se ha guardado la publicación', success: false });
            return res.status(200).send({ message: 'Publicación guardada exitosamente', success: true });
        });
    } else {
        return res.status(200).send({ mensaje: 'Todos los campos son requeridos', success: false });
    }
}

async function getTipoPregunta() {
    var preguntaResp = await Tipo.findOne({ nombre: 'pregunta' }, (err, pregunta) => {
        if (err) return handleError(err);
        return pregunta;
    });
    return preguntaResp;
}

module.exports = {
    newPublication
}
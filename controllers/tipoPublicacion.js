'use strict'

var Tipo = require('../models/tipoPublicacion');
var Publicacion = require('../models/publicacion');
// nuevo tipo
function newTipo(req, res) {
    var params = req.body;
    var tipo = new Tipo();
    if (params.nombre) {
        tipo.nombre = params.nombre.toLowerCase();

        Tipo.findOne({ nombre: tipo.nombre }).exec((err, tipos) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });
            if (tipos) {
                return res.status(200).send({ success: false, message: 'Ya existe un tipo con ese nombre' });
            } else {
                tipo.save((err, tipoStored) => {
                    if (err) return res.status(500).send({ message: 'Error al guardar tipo' });
                    if (tipoStored) {
                        res.status(200).send({ success: true, message: 'Tipo registrado' });
                    } else {
                        res.status(200).send({ success: false, message: 'No se ha registrado tipo' });
                    }
                });
            }
        });


    }
}
//editar tipo
function editTipo(req, res) {
    var params = req.body;
    params.nombre = params.nombre.toLowerCase();

    Tipo.findByIdAndUpdate(params.id, params, { new: true }, (err, tipoEdited) => {
        if (err) return res.status(200).send({ message: 'Error en la peticion', success: false });

        if (tipoEdited) {
            return res.status(200).send({ message: 'Tipo editado correctamente', success: true });
        } else {
            return res.status(200).send({ message: 'No se ha editado tipo', success: false });
        }
    });
}
//obtener todos los tipos
function getAllTipo(req, res) {
    Tipo.find((err, tipos) => {
        if (err) return res.status(200).send({ message: "Error al recuperar tipos de publicaciones", success: false });
        if (!tipos) return res.status(200).send({ message: "No hay tipos disponibles", success: false });

        return res.status(200).send({
            tipos
        });
    }).sort('_id');
}

//obtener tipo por id
function getTipoById(req, res) {
    var tipoId = req.params.id;
    Tipo.findById(tipoId, (err, tipo) => {
        if (err) return res.status(200).send({ message: "Error al buscar tipo de publicacion", success: false });
        if (!tipo) return res.status(200).send({ message: "No se ha encontrado tipo de publicacion", success: false });
        return res.status(200).send({
            tipo
        });
    });
}

//borrar tipo
async function deleteTipo(req, res) {
    var params = req.body;
    var tipoId = params.id;

    var publicacionesCounter = await getPublicaciones(tipoId);
    if (publicacionesCounter > 0) {
        return res.status(200).send({ message: 'No se puede borrar tipo ya que está ligado a publicaciones', success: false });
    }

    Tipo.deleteOne({ _id: tipoId }, err => {
        if (err) return res.status(200).send({ message: 'Error al eliminar tipo', success: false });

        return res.status(200).send({ message: 'Tipo eliminado', success: true });
    })
}

async function getPublicaciones(tipoId) {
    var publicaciones = await Publicacion.countDocuments({ idTipo: tipoId }, (err, counter) => {
        if (err) return handleError(err);
        console.log('Count is ' + counter);
        return counter;
    });
    return publicaciones;
}

module.exports = {
    newTipo,
    editTipo,
    deleteTipo,
    getAllTipo,
    getTipoById
}
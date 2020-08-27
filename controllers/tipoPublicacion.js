'use strict'

var Tipo = require('../models/tipoPublicacion');

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

module.exports = {
    newTipo
}
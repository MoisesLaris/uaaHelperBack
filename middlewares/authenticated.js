'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'aplicacion_para_la_tesis_de_la_uaa_jeje';

exports.ensureAuth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'La petición no tiene la cabecera de autenticación' });
    }
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()) {
            return res.status(200).send({
                message: 'El token ha expirado'
            });
        }
    } catch (ex) {
        return res.status(200).send({
            message: 'El token no es valido'
        });
    }

    req.user = payload;
    next();
}
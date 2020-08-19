'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'aplicacion_para_la_tesis_de_la_uaa_jeje';

exports.createToken = function(user) {
    var payload = {
        sub: user._id, //sub en jwt comunmente es el identificador (id)
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};
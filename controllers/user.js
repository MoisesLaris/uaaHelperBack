'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function home(req, res) {
    res.status(200).send({
        message: 'hola mundo'
    });
}

function pruebas(req, res) {
    console.log(req.body);
    res.status(200).send({
        message: 'quiubo'
    });
}

function newUser(req, res) {
    var params = req.body;
    var user = new User();
    console.log(params);
    if (params.nombre && params.apellidos && params.email && params.password) {
        user.nombre = params.nombre;
        user.apellidos = params.apellidos;
        user.email = params.email.toLowerCase();

        User.findOne({ email: user.email.toLowerCase() }).exec((err, users) => {
            if (err) return res.status(500).send({ message: 'Error en la peticion' });

            if (users) {
                return res.status(200).send({
                    success: false,
                    message: 'Este usuario ya existe'
                });
            } else {
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) return err.status(500).send({ message: 'Error al guardar el usuario' });
                        if (userStored) {
                            res.status(200).send({ success: true, message: 'Usuario registrado' });
                        } else {
                            res.status(200).send({ success: true, message: 'No se ha registrado el usuario' });
                        }
                    })
                });
            }
        });
    } else {
        res.status(200).send({
            success: false,
            message: 'Algunos campos están incompletos'
        })
    }
}

function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error al hacer login' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (!check) {
                    return res.status(200).send({ message: 'Error en email y/o password' });
                } else {
                    //Exito !!
                    user.password = undefined;
                    return res.status(200).send({
                        token: jwt.createToken(user)
                    });
                }

            })
        } else {
            return res.status(200).send({
                success: false,
                message: 'El usuario no se ha podido identificar'
            })
        }
    })
}


module.exports = {
    home,
    pruebas,
    newUser,
    loginUser
}
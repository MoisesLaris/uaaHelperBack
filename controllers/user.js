'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');
var im = require('imagemagick');
var secret = 'aplicacion_para_la_tesis_de_la_uaa_jeje';
var jwtLibrary = require('jwt-simple');
var moment = require('moment');

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
        user.isAdmin = false;
        user.image = null;

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

function newUserAdmin(req, res) {
    var params = req.body;
    var user = new User();
    console.log(params);
    if (params.nombre && params.apellidos && params.email && params.password && params.isAdmin) {
        user.nombre = params.nombre;
        user.apellidos = params.apellidos;
        user.email = params.email.toLowerCase();
        user.image = null;
        user.isAdmin = params.isAdmin;
        console.log('usuario a guardar: ', user);

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

function editUser(req, res) {
    var params = req.body;
    var update = req.body;
    if (update.password) delete update.password;
    if (update.email) delete update.email;

    console.log(params);
    if (params.id && params.nombre && params.apellidos && (params.isAdmin != null)) {
        User.findByIdAndUpdate(params.id, update, (err, userUpdated) => {
            if (err) return res.status(200).send({ message: 'Error al editar usuario', success: false });
            if (userUpdated) {
                return res.status(200).send({ message: 'Usuario editado con exito', success: true });
            }
            return res.status(200).send({ message: 'Error al editar usuario', success: false });
        });
    } else {
        return res.status(200).send({
            success: false,
            message: 'Algunos campos están incompletos'
        })
    }
}

function loginUser(req, res) {
    var params = req.body;
    console.log(params);
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error al hacer login' });

        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                console.log(check);
                if (!check) {
                    return res.status(200).send({ message: 'Error en email y/o password' });
                } else {
                    //Exito !!
                    user.password = undefined;
                    return res.status(200).send({
                        token: jwt.createToken(user),
                        user: user
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

function getAllUsers(req, res) {
    User.find((err, usuarios) => {
        if (err) return res.status(200).send({ message: 'Error al obtener usuarios', success: false });
        if (!usuarios) return res.status(200).send({ message: 'No se encontró ningún usuario', success: false });
        usuarios.forEach(usuario => {
            usuario.password = undefined;
        });
        return res.status(200).send({
            usuarios
        });
    });
}

function getUserById(req, res) {
    var idUser = req.params.id;
    User.findById(idUser, (err, usuario) => {
        if (err) return res.status(200).send({ message: 'No se encontró el usuario', success: false });
        if (!usuario) return res.status(200).send({ message: 'No se encontró el usuario', success: false });
        usuario.password = undefined;
        return res.status(200).send({
            usuario
        });
    });
}

function uploadImage(req, res) {
    console.log(req.params);
    console.log(req.user);
    var userId = req.params.id;
    if (req.files) {
        console.log(req.files);
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split("\.");

        var file_ext = ext_split[1];
        console.log(file_path);

        if (userId != req.user.sub) {
            return removeFilesOfUploads(file_path, 'No tienes permisos para subir imagen a otra cuenta', res);
        }
        if (req.user.image != null || req.user.image != undefined || req.user.image != '') {
            fs.unlink('uploads/users/' + req.user.image, (err) => {
                if (err) console.log(err);
            });
        }

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            im.resize({
                srcPath: file_path,
                dstPath: file_path,
                width: 350
            }, function(err, stdout, stderr) {
                if (err) removeFilesOfUploads(file_path, 'Error al guardar imagen', res);
            });
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
                if (err) return res.status(200).send({ message: 'No se pudo subir imagen', success: false });
                if (!userUpdated) return res.status(200).send({ message: 'No se pudo subir imagen', success: false });
                return res.status(200).send({ user: userUpdated, token: jwt.createToken(userUpdated), success: true, message: 'Imagen guardada con exito' });
            });
        } else {
            return removeFilesOfUploads(file_path, 'Extension del archivo no valida', res);
        }
    }
}

function removeFilesOfUploads(file_path, message, res) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message, success: false });
        return res.status(200).send({ message: message, success: false });
    });
}

function getProfileImage(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/' + image_file;
    console.log(image_file);
    fs.exists(path_file, (exists) => {
        if (exists) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.sendFile(path.resolve('./uploads/notfound.jpg'));
        }
    })
}

function verifySession(req, res) {
    if (req.body.token) {
        var token = req.body.token;

        try {
            var payload = jwtLibrary.decode(token, secret);
            if (payload.exp <= moment().unix()) {
                return res.status(200).send({
                    message: 'El token ha expirado',
                    success: false
                });
            }
        } catch (ex) {
            return res.status(200).send({
                message: 'El token no es valido',
                success: false
            });
        }

        return res.status(200).send(payload);
    } else {
        return res.status(200).send({ message: 'No se ha enviado token', success: false });
    }
}


module.exports = {
    home,
    pruebas,
    newUser,
    newUserAdmin,
    loginUser,
    getAllUsers,
    getUserById,
    uploadImage,
    getProfileImage,
    verifySession,
    editUser
}
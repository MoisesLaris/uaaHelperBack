'use strict'

var Tipo = require('../models/tipoPublicacion');
var Publicacion = require('../models/publicacion');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');
var im = require('imagemagick');



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
                publicacion.tipoPublicacion = params.tipoPublicacion;
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
    var itemsPerPage = 15;

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



function getFavoriteQuestions(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 15;

    Publicacion.find({ isQuestion: true, users: req.user.sub }).sort('_id').populate('idUser').paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer preguntas' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay preguntas' });
        return res.status(200).send({
            questions,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function getMyQuestions(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 15;

    Publicacion.find({ isQuestion: true, idUser: req.user.sub }).sort('_id').populate('idUser').paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer preguntas' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay preguntas' });
        return res.status(200).send({
            questions,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function getPosts(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 15;

    Publicacion.find({ isQuestion: false }).sort({ fecha: 'descending' }).populate([{ path: 'idUser' }, { path: 'tipoPublicacion' }]).paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer publicaciones' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay publicaciones' });
        console.log(questions);

        return res.status(200).send({
            total,
            questions,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function getPostAscending(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 15;

    Publicacion.find({ isQuestion: false }).sort("_id").populate([{ path: 'idUser' }, { path: 'tipoPublicacion' }]).paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer publicaciones' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay publicaciones' });
        console.log(questions);

        return res.status(200).send({
            total,
            questions,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function getPostFavorites(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 15;

    Publicacion.find({ isQuestion: false }).sort({ "usersLength": -1 }).populate([{ path: 'idUser' }, { path: 'tipoPublicacion' }]).paginate(page, itemsPerPage, (err, questions, total) => {
        if (err) return res.status(500).send({ success: false, message: 'Error al traer publicaciones' });
        if (!questions) res.status(500).send({ success: false, message: 'No hay publicaciones' });
        console.log(questions);

        return res.status(200).send({
            total,
            questions,
            pages: Math.ceil(total / itemsPerPage)
        });
    });
}

function getSeachPost(req, res) {
    var name = '';
    if (req.params.name) {
        name = req.params.name;
    }
    Publicacion.find({ isQuestion: false, titulo: name }, (err, publicaciones) => {
        if (err) return res.status(200).send({ message: 'Error al encontrar resultados', success: false });
        if (!res) return res.status(200).send({ message: 'Error al encontrar resultados', success: false });
        return res.status(200).send({ questions: publicaciones });
    }).populate([{ path: 'idUser' }, { path: 'tipoPublicacion' }]);
}


function editarPost(req, res) {
    var params = req.body;
    var objUpdate = {
        'titulo': params.titulo,
        'mensaje': params.mensaje,
        'tipoPublicacion': params.tipoPublicacion
    }
    Publicacion.findByIdAndUpdate(params.id, objUpdate, { new: true }, (err, tipoEdited) => {
        if (err) return res.status(200).send({ message: 'Error en la peticion', success: false });

        if (tipoEdited) {
            return res.status(200).send({ message: 'Publicación editada correctamente', success: true });
        } else {
            return res.status(200).send({ message: 'No se ha editado publicación', success: false });
        }
    });
}

function deletePost(req, res) {
    var params = req.body;
    var publicacionId = params.id;

    Publicacion.deleteOne({ _id: publicacionId }, err => {
        if (err) return res.status(200).send({ message: 'Error al eliminar tipo', success: false });

        return res.status(200).send({ message: 'Publicación eliminada', success: true });
    })
}

function likePost(req, res) {
    var params = req.body;

    var conditionsIfNot = {
        _id: params.id,
        'users': { $ne: req.user.sub }
    };
    var updateIfNot = {
        $addToSet: { users: req.user.sub },
        $inc: { usersLength: 1 }
    }
    Publicacion.findOneAndUpdate(conditionsIfNot, updateIfNot, { new: true }, function(err, publicacionNot) {
        if (err) return res.status(500).send('error');
        if (publicacionNot) return res.status(200).send({ message: 'like removed', success: true, id: true });
        else {
            Publicacion.findOneAndUpdate({ _id: params.id, 'users': req.user.sub }, { $pull: { users: req.user.sub }, $inc: { usersLength: -1 } }, { new: true }, (err, publicacionYes) => {
                if (err) return res.status(500).send('error');
                if (publicacionYes) return res.status(200).send({ message: 'like removed', success: true, id: false });
                else {
                    return res.status(500).send('error');
                }
            });
        }

    });

}

function uploadImage(req, res) {

    if (req.files) {
        console.log(req.files);
        var file_path = req.files.image.path;
        var file_split = file_path.split('\/');
        var file_name = file_split[2];
        var ext_split = file_name.split("\.");

        var file_ext = ext_split[1];
        console.log(file_path);

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
            im.resize({
                srcPath: file_path,
                dstPath: file_path,
                quality: 0.6,
                width: 400
            }, function(err, stdout, stderr) {
                if (err) removeFilesOfUploads(file_path, 'Error al guardar imagen', res);
            });
            return res.status(200).send({ success: true, message: 'Imagen guardada con exito', id: file_name });
        } else {
            return removeFilesOfUploads(file_path, 'Extension del archivo no valida', res);
        }
    }
}

function getPostImage(req, res) {
    var image_file = req.params.imageFile;
    var path_file = './uploads/post/' + image_file;
    console.log(image_file);
    fs.exists(path_file, (exists) => {
        if (exists) {
            return res.sendFile(path.resolve(path_file));
        } else {
            return res.sendFile(path.resolve('./uploads/notfound.jpg'));
        }
    })
}

function removeFilesOfUploads(file_path, message, res) {
    fs.unlink(file_path, (err) => {
        if (err) return res.status(200).send({ message: message, success: false });
        return res.status(200).send({ message: message, success: false });
    });
}




module.exports = {
    newPublication,
    getQuestions,
    likePost,
    getFavoriteQuestions,
    getMyQuestions,
    uploadImage,
    getPostImage,
    getPosts,
    getPostAscending,
    getPostFavorites,
    editarPost,
    deletePost,
    getSeachPost
}
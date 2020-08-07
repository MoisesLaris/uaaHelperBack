'use strinc'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;


mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://ProyectoCheco:proyectoch3c0@proyectocheco-v8da3.azure.mongodb.net/uaa?retryWrites=true&w=majority', { useMongoClient: true })
    //mongoose.connect('mongodb+srv://ProyectoCheco:proyectoch3c0@proyectocheco-v8da3.azure.mongodb.net/congreso?retryWrites=true&w=majority', { useMongoClient: true })
    //mongoose.connect('mongodb://192.168.0.114:27017/congreso', { mongos: true })
    .then(() => {
        console.log('Conexión exitosa! Gracias al moisi precioso');

        //Crear servidor
        app.listen(port, () => {
            console.log("Servidor corriendo en localhost:3800");
        });
    })
    .catch((err) => {
        console.log(err, '');
    })
const express = require('express');
const fileUpload = require('express-fileupload');
const usuario = require('../models/usuario');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'
                }
            })
    };

    //valida tipo
    let tiposValidos = ['productos','usuarios'];
    if(tiposValidos.indexOf(tipo) <0 ){
        return res.status(400).json({
            ok: false,
            err: {
                message: `Los tipos permitidas son: (${tiposValidos})`
            }
        });
    }


    //info del archivo
    let archivo = req.files.archivo;
    let spliArchivo = archivo.name.split('.');
    let extencionArchivo = spliArchivo[spliArchivo.length -1];

    //extenciones permitidas
    let exValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (exValidas.indexOf(extencionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extenciones permitidas son: (${exValidas})`,
                ext: extencionArchivo
            }
        });
    };

    //asignando nombre al archivo
    let nombrearchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`

    archivo.mv(`uploads/${tipo}/${nombrearchivo}`, (err) => {
        if (err){
          return res.status(500).json({
              ok: false,
              err
            });
        };

        //Aqui, la imagen se cargo
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombrearchivo);
            break;
            case 'productos':
                imagenProducto(id, res, nombrearchivo);
            break;
            default:
            break;
        };
    });
    
});

function imagenUsuario(id, res, nombrearchivo) {
    Usuario.findById(id, (err,usuarioDB) => {
        if (err){
            borraArchivo(nombrearchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!usuarioDB){
            borraArchivo(nombrearchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no exite'
                }
            });
        };

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombrearchivo;

        usuarioDB.save((err, usuarioGuardado) => {
                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    img: nombrearchivo
                });
        });
    });
}

function imagenProducto(id, res, nombrearchivo) {
    Producto.findById(id, (err,productoDB) => {
        if (err){
            borraArchivo(nombrearchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!productoDB){
            borraArchivo(nombrearchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no exite'
                }
            });
        };

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombrearchivo;

        productoDB.save((err, productoGuardado) => {
                res.json({
                    ok: true,
                    producto: productoGuardado,
                    img: nombrearchivo
                });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;
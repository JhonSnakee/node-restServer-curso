//Import express
const express = require('express');
const app = express();

//Import bcrypt
const bcrypt = require('bcrypt');

//Import underscore
const _ = require('underscore');

// Import model usuario
const Usuario = require('../models/usuario');

const {verificaToken, verificaAdminRol} = require('../middlewares/autenticacion');


// get  Obtener data
app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
                                //Que deseo ver en el get
    Usuario.find({estado:true}/*, 'nombre email role'*/)
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,  
                    err  
                });
            };
            Usuario.count({estado:true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos : conteo
                });
            });
        });
});

// post  Insertar nueva data
app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,  
                err  
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// put/patch  Actualizar data
app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);

    Usuario.findByIdAndUpdate(id, body, {new:true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,  
                err  
            });
        };

        res.json({
            ok: true,
            usuario: usuarioDB
        })  
    })
})

// delete  Borrar data
app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new:true},(err, usuarioBorrado) => {
    
        if (err) {
            return res.status(400).json({
                ok: false,  
                err  
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,  
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })  
    })
})

module.exports = app;
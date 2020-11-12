require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

 
// get  Obtener data
app.get('/usuario', function (req, res) {
  res.json('get Usuario')
})
// post  Insertar nueva data
app.post('/usuario', function (req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    }else{
        res.json({
            persona : body
        })
    }
    
})
// put/patch  Actualizar data
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})
// delete  Borrar data
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario')
})

// Escuchando
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
})
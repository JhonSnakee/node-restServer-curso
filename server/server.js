const path = require('path')
require('./config/config');

//Import express
const express = require('express');
const app = express();

//Import mongoose
const mongoose = require('mongoose');

//Import body parser
const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Habilitar el public
const direct = path.resolve(__dirname , '../public');
app.use(express.static(direct));

//configuracion global de rutas
app.use(require('./routes/index'));

//Coneccion base
mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false},
    (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
})

// Escuchando
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
})
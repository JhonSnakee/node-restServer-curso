//Import config
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

//Import usuario
app.use(require('./routes/usuario'));

//Coneccion base
mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    (err, res) => {
    if (err) throw err;

    console.log('Base de datos ONLINE');
})

// Escuchando
app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
})
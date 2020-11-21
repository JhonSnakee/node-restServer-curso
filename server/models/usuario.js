//Import mongoose
const mongoose = require('mongoose');

//Import Unique Validator
const uniqueValidator = require('mongoose-unique-validator');

//Definir roles validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{type: String,required: [true, 'El nombre es necesario']},
    email:{type: String,unique: true,required: [true, 'El correo es necesario']},
    password:{type: String,required: [true, 'La contraseña es obligatoria']},
    img:{type: String,required: false},
    role:{type: String,default: 'USER_ROLE',enum: rolesValidos},
    estado:{type: Boolean,default: true},
    google:{type: Boolean,default: false},
});

//Eliminar datos que se muestran al usuario
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password
    return userObject
}

//Mensaje para dato unico
usuarioSchema.plugin(uniqueValidator,{message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Usuario', usuarioSchema);
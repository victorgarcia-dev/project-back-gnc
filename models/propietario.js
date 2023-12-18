const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropietarioSchema = new Schema({
    name: String,
    lastName: String,
    adress: String,
    cp: String,
    country: String,
    contactNum: String,
    nroDoc: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});



let Propietario = mongoose.model('Propietario', PropietarioSchema);
module.exports = Propietario;
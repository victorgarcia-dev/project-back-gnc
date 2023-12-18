
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObleaSchema = new Schema({
    fechaHabilitacion: Date,
    obleaAnterior: String,
    fechaVencimiento: Date,
    obleaNueva: String,
    tipoOperacion: String,
    created: Date,
    updated: Date
});


let Oblea = mongoose.model('Oblea', ObleaSchema);
module.exports = Oblea;
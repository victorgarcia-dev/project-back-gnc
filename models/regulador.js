const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReguladorSchema = new Schema({
    codigo_actual: String,
    codigo_montaje: String,
    codigo_desmontaje: String,
    codigo_baja: String,
    nro_serie_actual: String,
    nro_serie_montaje: String,
    nro_serie_desmontaje: String,
    nro_serie_baja: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});


let Regulador = mongoose.model('Regulador', ReguladorSchema);
module.exports = Regulador;
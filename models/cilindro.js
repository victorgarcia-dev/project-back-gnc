const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CilindroSchema = new Schema({
    codigo_cil: String,
    nro_serie_cil: String,
    nuevo_cil: String,
    usado_cil: String,
    fabricado_mes_cil: String,
    fabricado_anio_cil: String,
    revisado_mes_cil: String,
    revisado_anio_cil: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});



let Cilindro = mongoose.model('Cilindro', CilindroSchema);
module.exports = Cilindro;
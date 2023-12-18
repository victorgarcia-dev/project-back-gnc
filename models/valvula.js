const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ValvulaSchema = new Schema({
    codigo_valvula_cil: String,
    nro_seria_valvula_cil: String,
    op_valvula_cil: String,
    created: Date,
    updated: Date
});



let Valvula = mongoose.model('Valvula', ValvulaSchema);
module.exports = Valvula;
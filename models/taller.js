const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TallerSchema = new Schema({
    name: String,
    codigoPec: String,
    codigoTaller: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});



let Taller = mongoose.model('Taller', TallerSchema);
module.exports = Taller;
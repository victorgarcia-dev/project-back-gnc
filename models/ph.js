const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhSchema = new Schema({
    crpc_cil: String,
    op_cil: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});



let Ph = mongoose.model('Ph', PhSchema);
module.exports = Ph;
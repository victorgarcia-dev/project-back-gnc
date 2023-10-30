const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    lastName: String,
    email: String,
    enabled: Boolean,
    created: Date,
    updated: Date
});

UserSchema.index({ 'email': 1 }, { unique: true });
UserSchema.index({ 'name': 1 });
UserSchema.index({ 'lastName': 1 });


let User = mongoose.model('User', UserSchema);
module.exports = User;
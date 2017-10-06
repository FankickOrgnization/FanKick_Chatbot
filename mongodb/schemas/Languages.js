var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguagesSchema = Schema({
    name: String,
}, { versionKey: false, collection: "Languages" });

var Languages = mongoose.model('Languages', LanguagesSchema);
exports = module.exports = Languages;

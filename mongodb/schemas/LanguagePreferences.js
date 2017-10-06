var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LanguagesSchema = Schema({
    country : String,
    state : String,
    city : String,
    language : {type : String, ref : 'Languages.name'}
}, { versionKey: false, collection: "LanguagePreferences" });

var LanguagePreferences = mongoose.model('LanguagePreferences', LanguagesSchema);
exports = module.exports = LanguagePreferences;

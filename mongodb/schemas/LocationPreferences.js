var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationPreferencesSchema = Schema({
    country : String,
    state : String,
    city : String,
    categories : {
        categoryName : {type : String , ref : 'Categories.name'},
        subCategoryName : {type : String , ref : 'Categories.subCategories.name'}
    }
}, { versionKey: false, collection: "LocationPreferences" });

var LocationPreferences = mongoose.model('LocationPreferences', LocationPreferencesSchema);
exports = module.exports = LocationPreferences;

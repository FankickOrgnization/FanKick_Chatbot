var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Subcategory Schema
subCategoriesSchema = Schema({
  _id : Schema.Types.ObjectId ,
    name : String
});

//Category Schema
CategoriesSchema = Schema({
    _id : Schema.Types.ObjectId ,
    name : String,
    subCategories : [subCategoriesSchema]
},{ versionKey: false , collection: "Categories" });

var categories = mongoose.model('Categories', CategoriesSchema);
module.exports = categories;
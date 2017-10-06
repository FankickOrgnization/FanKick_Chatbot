var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuickrepliesSchema = Schema({
    categories : {
        categoryName : {type : String , ref : 'Categories.name'},
        subCategoryName : {type : String , ref : 'Categories.subCategories.name'}
    },
    Celebrity_Name:String,
    Title:String,
    Discription:String,
    ImageUrl:String
}, { versionKey: false, collection: "QuickReplyButtons" });

var QuickReplyButtons = mongoose.model('QuickReplyButtons', QuickrepliesSchema);
exports = module.exports = QuickReplyButtons;

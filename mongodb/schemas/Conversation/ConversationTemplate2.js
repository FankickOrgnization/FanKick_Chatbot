var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    location: String,
    celebrityName: String,
    descriptionOne: String,
    descriptionTwo: String,
    descriptionThree: String
}, { versionKey: false, collection: "ConversationTwo" });

var ConversationTwo = mongoose.model('ConversationTwo', ConversationSchema);
exports = module.exports = ConversationTwo;

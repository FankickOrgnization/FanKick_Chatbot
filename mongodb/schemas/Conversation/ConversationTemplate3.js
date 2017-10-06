var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    location: String,
    celebrityName: String,
    description: String,
    buttonOneName: String,
    buttonOneUrl: String,
    buttonOneDescription: String,
    buttonTwoName: String,
    buttonTwoUrl: String,
    buttonTwoDescription: String,
    buttonThreeName: String,
    buttonThreeUrl: String,
    buttonThreeDescription: String
}, { versionKey: false, collection: "ConversationThree" });

var ConversationThree = mongoose.model('ConversationThree', ConversationSchema);
exports = module.exports = ConversationThree;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SportsSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    celebrityName: String,
    countryName: String,
    title: String,
    team1: String,
    team2: String,
    imageUrl: String,
    articleUrl: String,
    quickReplyTitle: String,
    suggestedQuickReply1: String,
    suggestedQuickReply2: String,
    suggestedQuickReply3: String,
    suggestedQuickReply4: String,
    suggestedQuickReply5: String,
    description: String
}, { versionKey: false, collection: "EntertainmentSports" });

var EntertainmentSports = mongoose.model('EntertainmentSports', SportsSchema);
exports = module.exports = EntertainmentSports;

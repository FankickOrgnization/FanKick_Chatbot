var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SportsSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    gender: String,
    name: String,
    country: String,
    skill: String,
    age: Number,
    awards: String,
    netWorth: String,
    news: String,
    competitors: String,
    googleSearch: String,
    personalInfo: String,
    sportsImageUrl1: String,
    sportsImageUrl2: String,
    sportsImageUrl3: String,
    sportsImageUrl4: String,
    sportsImageUrl5: String
}, { versionKey: false, collection: "CelebritySports" });

var CelebritySports = mongoose.model('CelebritySports', SportsSchema);
exports = module.exports = CelebritySports;

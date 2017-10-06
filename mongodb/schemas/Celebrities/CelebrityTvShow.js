var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TvShowSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    name: String,
    gender: String,        
    skill:String,
    age: Number,
    awards: String,
    netWorth: String,
    news: String,       
    competitors: String,
    popularTVShows: String,
    googleSearch: String,
    personalInfo: String,
    tvShowImageUrl1: String,
    tvShowImageUrl2: String,
    tvShowImageUrl3: String,
    tvShowImageUrl4: String,
    tvShowImageUrl5: String
}, { versionKey: false, collection: "CelebrityTvShow" });

var CelebrityTvShow = mongoose.model('CelebrityTvShow', TvShowSchema);
exports = module.exports = CelebrityTvShow;

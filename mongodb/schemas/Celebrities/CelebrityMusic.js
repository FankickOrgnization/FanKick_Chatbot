var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicSchema = Schema({
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
    popularSongs: String,
    popularAlbums: String,
    googleSearch: String,
    personalInfo: String,
    musicImageUrl1: String,
    musicImageUrl2: String,
    musicImageUrl3: String,
    musicImageUrl4: String,
    musicImageUrl5: String
}, { versionKey: false, collection: "CelebrityMusic" });

var CelebrityMusic = mongoose.model('CelebrityMusic', MusicSchema);
exports = module.exports = CelebrityMusic;

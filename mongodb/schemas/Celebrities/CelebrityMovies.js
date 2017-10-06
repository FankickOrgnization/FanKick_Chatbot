var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MoviesSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    gender: String,
    name: String,
    age: Number,
    awards: String,
    netWorth: String,
    familyDetails: String,
    news: String,
    faceBookHandle: String,
    twitterHandle: String,
    latestMovie: String,
    lastFiveBestMovies: String,
    competitors: String,
    nextMovie: String,
    googleSearch: String,
    personalInfo: String,
    movieImageUrl1: String,
    movieImageUrl2: String,
    movieImageUrl3: String,
    movieImageUrl4: String,
    movieImageUrl5: String
}, { versionKey: false, collection: "CelebrityMovies" });

var CelebrityMovies = mongoose.model('CelebrityMovies', MoviesSchema);
exports = module.exports = CelebrityMovies;

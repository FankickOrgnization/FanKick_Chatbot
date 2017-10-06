var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MoviesSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    movieName: String,
    genre: String,
    leadActor: String,
    leadActress: String,
    director: String,
    musicDirector: String,
    movieInfoUrl: String,
    releaseDate: Date,
    googleSearch: String,
    movieReviews: String,
    trailerUrl: String,
    movieAudioUrl: String,
    movieImageUrl1: String,
    movieImageUrl2: String,
    movieImageUrl3: String,
    movieImageUrl4: String,
    movieImageUrl5: String,
    movieNewsUrl: String
}, { versionKey: false, collection: "EntertainmentMovies" });

var EntertainmentMovies = mongoose.model('EntertainmentMovies', MoviesSchema);
exports = module.exports = EntertainmentMovies;

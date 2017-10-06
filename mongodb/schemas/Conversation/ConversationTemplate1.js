var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConversationSchema = Schema({
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
}, { versionKey: false, collection: "ConversationOne" });

var ConversationOne = mongoose.model('ConversationOne', ConversationSchema);
exports = module.exports = ConversationOne;

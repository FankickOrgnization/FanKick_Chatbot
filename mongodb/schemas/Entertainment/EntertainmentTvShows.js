var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TvShowsSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    language: String,
    showName: String,
    releaseDate: Date,
    cast: String,
    leadActor: String,
    leadActress: String,
    clips: String,
    googleSearch: String,
    newsUrl: String,
    tvShowsImageUrl1: String,
    tvShowsImageUrl2: String,
    tvShowsImageUrl3: String,
    tvShowsImageUrl4: String,
    tvShowsImageUrl5: String
}, { versionKey: false, collection: "EntertainmentTvShows" });

var EntertainmentTvShows = mongoose.model('EntertainmentTvShows', TvShowsSchema);
exports = module.exports = EntertainmentTvShows;

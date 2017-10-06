var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MusicAlbumsSchema = Schema({
    categories: {
        categoryName: { type: String, ref: 'Categories.name' },
        subCategoryName: { type: String, ref: 'Categories.subCategories.name' }
    },
    language: String,
    albumName: String,
    releaseDate: Date,
    artistName: String,
    googleSearch: String,
    musicAlbumUrl: String,
    musicImageUrl1: String,
    musicImageUrl2: String,
    musicImageUrl3: String,
    musicImageUrl4: String,
    musicImageUrl5: String
}, { versionKey: false, collection: "EntertainmentMusicAlbums" });

var EntertainmentMusicAlbums = mongoose.model('EntertainmentMusicAlbums', MusicAlbumsSchema);
exports = module.exports = EntertainmentMusicAlbums;

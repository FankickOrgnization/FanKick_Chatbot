var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var logger = require('../logger')

mongoose.connect('mongodb://admin:Gemini1234@ds113713.mlab.com:13713/chatbot');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database Connection Error:'));
db.once('open', function () {
  logger.debug('Connected to the database successfully.');
});

exports = module.exports = {
  mongoose: mongoose
};
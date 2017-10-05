var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = Schema({
    email: String,
    username: String,
    password: String,
    fname: String,
    lname: String,
    contact: String,
    isAccountActive: String
}, { versionKey: false, collection: "Accounts" });

var Account = mongoose.model('Accounts', AccountSchema);
exports = module.exports = Account;

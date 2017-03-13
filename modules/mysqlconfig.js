var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fetch = require('node-fetch');
const crypto = require('crypto');
const thread = require('./modules/thread.js');
const payloadText = require('./modules/payload.js');
const searchText = require('./modules/search.js');
const movies = require('./modules/movies.js');
const fbRquest = require('./modules/fbapi.js');
var googleTrends = require('google-trends-api');
//const bot = require('./wit.js');

var pool = mysql.createPool({connectionLimit: 4, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});


module.exports = {
    //sendContentPacks: sendContentPacks,
    //fbuserdetails:fbuserdetails,
    // name:name,
    pool: pool
};

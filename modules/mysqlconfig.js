'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
const movie = require('../contentjson/movies.json');
const sport = require('../contentjson/sports.json');
const tv_show = require('../contentjson/tv shows.json');
const musics = require('../contentjson/music.json');
const jokes = require('../contentjson/jokes.json');
var mysql = require('mysql');
var mysqlpool = mysql.createPool({connectionLimit: 4, host: 'ap-cdbr-azure-east-a.cloudapp.net', user: 'baf93eb18b41b5', password: '2a7d14a8', database: 'myshoptv'});

module.exports = {
    mysqlpool: mysqlpool
};

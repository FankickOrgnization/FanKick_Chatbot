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
var mysqlpool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});

module.exports = {
    mysqlpool: mysqlpool
};

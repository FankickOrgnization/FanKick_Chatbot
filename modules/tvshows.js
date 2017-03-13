'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
//const movie = require('../contentjson/movies.json');
//const sport = require('../contentjson/sports.json');
//const tv_show = require('../contentjson/tv shows.json');
//const musics = require('../contentjson/music.json');
const jokes = require('../contentjson/jokes.json');
const fbRquest = require('./fbapi.js');
const mysqlconfig = require('./mysqlconfig.js');
//var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';
var quickreply = [
    {
        "content_type": "text",
        "title": "Movies 🎬",
        "payload": "Movies"
    }, {
        "content_type": "text",
        "title": "Sports 🏆",
        "payload": "Sports"
    }, {
        "content_type": "text",
        "title": "Music 🎶",
        "payload": "Music"
    }, {
        "content_type": "text",
        "title": "TV Shows 📺",
        "payload": "TV Shows"
    }
];



const tvshowsintro = (messagingEvent, tvshowsmsg) => {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message":{
            "text": tvshowsmsg
          }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvshowsmenu(messagingEvent);
}

function tvshowsmenu(messagingEvent){
  pool.getConnection(function(err, connection) {
      connection.query('select  * from cc_tvshows', function(err, rows) {
          console.log("*************************selectedactorfilems", rows);
          if (err) {
              console.log("Error While retriving content pack data from database:", err);
          }else if (rows.length) {
              var senderID = messagingEvent.sender.id;
              var contentList = [];
              if (rows.length > 10) {
                  var rowslenth = 10;
                  console.log("more than 10 Rows", rowslenth);
              } else {
                  var rowslenth = rows.length;
                  console.log("less than 10 Rows", rowslenth);
              }
              for (var i = 0; i < rowslenth; i++) { //Construct request body
                  var keyMap = {
                      "title": rows[i].name,
                      "image_url": rows[i].picture1,
                      "buttons": [
                          {
                              "type": "postback",
                              "title": "More Info",
                              "payload": rows[i].name + ' %tvshows%'
                          }
                      ]
                  };
                  contentList.push(keyMap);
              }
              var messageData = {
                  "recipient": {
                      "id": senderID
                  },
                  "message": {
                      "attachment": {
                          "type": "template",
                          "payload": {
                              "template_type": "generic",
                              "elements": contentList
                          }
                      },
                      "quick_replies": [
                          {
                              "content_type": "text",
                              "title": "Latest",
                              "payload":"Latest",
                          },
                          {
                              "content_type": "text",
                              "title": "Animation",
                              "payload": "Animation"
                          }, {
                              "content_type": "text",
                              "title": "Romance",
                              "payload": "Romance"
                          }, {
                              "content_type": "text",
                              "title": "Comedy",
                              "payload":"Comedy"
                          }, {
                              "content_type": "text",
                              "title": "Reality",
                              "payload": "Reality"
                          }, {
                              "content_type": "text",
                              "title": "Documentary",
                              "payload": "Documentary"
                          }, {
                              "content_type": "text",
                              "title": "Google Search",
                              "payload": "Google Search"
                          }, {
                              "content_type": "text",
                              "title": "Home 🏠",
                              "payload": "home"
                          }
                      ]
                  }
              }
              fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
          }else {
              console.log("No Data Found From Database");
              sendHelpMessage(messagingEvent);
          }
          connection.release();
      });
  });

}





function sendHelpMessage(event) {
          var errorString = "";
          while (errorString === "") {
              var random = Math.floor(Math.random() * errors.length);
              if (errors[random].error.length < 320) // better be a least one good joke :)
                  errorString = errors[random].error;
              }
          var senderID = event.sender.id;
          var messageData = {
              "recipient": {
                  "id": senderID
              },
              "message": {
                  "text": errorString,
                  //"text":"msg",
                  "quick_replies": quickreply
              }
          }
          fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
}

module.exports = {
    tvshowsintro: tvshowsintro
};

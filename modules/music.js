'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
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

const musicalbams = (categoryName, event) =>{
  var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_albums where subCategory = (select id from cc_subcategories where subCategoryName= ?)',[categoryName], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            }
            else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                if (rows.length > 10) {
                    var rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    var rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                  var name = rows[i].name;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].artist,
                        "buttons": [
                          {
                              "type": "postback",
                              "title": "Read More",
                              "payload": rows[i].name+" %albumname%"
                          }
                          // {
                          //     "type": "web_url",
                          //     "url": rows[i].albumUrl,
                          //     "title": "view Album"
                          // },{
                          //     "type": "web_url",
                          //     "url": rows[i].googleSearch,
                          //     "title": "Google Search"
                          // },
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
                                "title": "Latest Albums",
                                "payload": "Latest Albums"
                            }, {
                                "content_type": "text",
                                "title": "Pop",
                                "payload": "Pop"
                            }, {
                                "content_type": "text",
                                "title": "Rock",
                                "payload": "Rock"
                            },{
                                "content_type": "text",
                                "title": "Movie Albums",
                                "payload": "Movie Albums"
                            }, {
                                "content_type": "text",
                                "title": "Sad Songs",
                                "payload": "Sad Songs"
                            },{
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            }
             else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
            connection.release();
        });
    });

}

const albuminfo = (messagingEvent, albumname) => {
  var event = messagingEvent;
  var quickList = [];
  var name;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_albums where name = ?',[albumname], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            }
            else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                if (rows.length > 10) {
                    var rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    var rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                  name = rows[i].artist;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].artist,
                        "buttons": [
                          {
                              "type": "web_url",
                              "url": rows[i].albumUrl,
                              "title": "view Album"
                          },{
                              "type": "web_url",
                              "url": rows[i].googleSearch,
                              "title": "Google Search"
                          },
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
                                "title": name,
                                "payload": name+" %musicartist%"
                            }, {
                                "content_type": "text",
                                "title": "Other Album 1",
                                "payload": "Other Album 1"
                            }, {
                                "content_type": "text",
                                "title": "Other Album 2",
                                "payload": "Other Album 2"
                            },{
                                "content_type": "text",
                                "title": "Release Date",
                                "payload": "Release Date"
                            },{
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            }
             else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
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
    musicalbams: musicalbams,
    albuminfo:albuminfo
};

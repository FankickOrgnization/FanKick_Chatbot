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

//function tvshowsinfo(messagingEvent, moviename)
const sportsqrintro = (messagingEvent, qrtitle) => {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": "Here you go👉..."
            //"text":msg
        }
        // "message": {
        //     "attachment": {
        //         "type": "audio",
        //         "payload": {
        //             "url": "https://petersapparel.com/bin/clip.mp3"
        //         }
        //     }
        // }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    sportsqrdetails(messagingEvent, qrtitle);
}
const sportsintro = (messagingEvent, tvshowsmsg) => {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": tvshowsmsg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    sportsmenu(messagingEvent);
}

const sportscelbrityintro = (messagingEvent, sportscelname) => {
    var senderID = messagingEvent.sender.id;
    var msg = 'Amazing talent👏! Here is what I know about ' + sportscelname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    sportscelbritydetails(messagingEvent, sportscelname);
}


function sportsmenu(messagingEvent){
  var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_preference order by id desc', function(err, rows) {
            console.log("*************************sportsmenu", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            }
            else if (rows.length) {
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
                        "title": rows[i].celebrity,
                        "image_url": rows[i].imageUrl,
                        "subtitle": rows[i].title,
                        "buttons": [
                          {
                              "type": "postback",
                              "title": "Read More",
                              "payload": rows[i].quickReplyTitle+ ' %sportsQRtitle%'
                          }
                        ]
                    };
                    // var quick_reply = {
                    //     "content_type": "text",
                    //     "title": rows[i].quickReplyTitle,
                    //     "payload": rows[i].quickReplyTitle+ ' %sportsQRtitle%'
                    // };
                    contentList.push(keyMap);
                    //quickList.push(quick_reply);
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
                                "title": "Sports Videos",
                                "payload": 'Sports Videos,sports,%QR%'
                            },{
                                "content_type": "text",
                                "title": "Cricket Info",
                                "payload": 'Cricket Info,sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Cricket Teams",
                                "payload": 'Cricket Teams,sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Cricket Schedules",
                                "payload": 'Cricket Schedules,sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Live Scores",
                                "payload": 'Live Scores,sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Cricket Results",
                                "payload": 'Cricket Results,sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Soccer Results",
                                "payload": 'Soccer Results,sports,%QR%'
                            },{
                                "content_type": "text",
                                "title": "home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            }
             else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}


function sportsqrdetails(messagingEvent, qrtitle){
  var qr1;
  var qr2;
  var qr3;
  var qr4;
  var qr5;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_preference where quickReplyTitle = ?',[qrtitle], function(err, rows) {
            console.log("*************************sportsmenu", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            }
            else if (rows.length) {
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
                        "title": rows[i].celebrity,
                        "image_url": rows[i].imageUrl,
                        "subtitle": rows[i].title,
                        "buttons": [
                          {
                              "type": "web_url",
                              "url": rows[i].articleUrl,
                              "title": "View Article"
                          },
                        ]
                    };
                    qr1 = rows[i].suggestedQuickReply1;
                    qr2 = rows[i].suggestedQuickReply2;
                    qr3 = rows[i].suggestedQuickReply3;
                    qr4 = rows[i].suggestedQuickReply4;
                    qr5 = rows[i].suggestedQuickReply5;
                    contentList.push(keyMap);
                    //quickList.push(quick_reply);
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
                                "title": qr1,
                                "payload": qr1+ ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr2,
                                "payload": qr2+ ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr3,
                                "payload": qr3+ ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr4,
                                "payload": qr4+ ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr5,
                                "payload": qr5+ ' %sportscel%'
                            }, {
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
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}

function sportscelbritydetails(messagingEvent, sportscelname){
  var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_celebrity_preference where name= ?',[sportscelname], function(err, rows) {
            console.log("*************************sportscelebrity", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            }
            else if (rows.length) {
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
                  var name = rows[i].name;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].skill+","+ rows[i].country,
                        "buttons": [
                          {
                              "type": "web_url",
                              "url": rows[i].personal,
                              "title": "About"
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
                                "title": "Pictures",
                                "payload": name + ' ,%sportscelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": name + ' ,%sportscelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": name + ' ,%sportscelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": name + ' ,%sportscelnews%'
                            },{
                                "content_type": "text",
                                "title": "Competitors",
                                "payload": name + ' ,%sportscelcompetitors%'
                            }, {
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
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}


const sportscelebrityinfo = (messagingEvent, quickpayloadtext) =>{
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    var sportmanname =actername.trim();
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_celebrity_preference where name = ?',[sportmanname], function(err, rows) {
            console.log("********filmactor*********", actername);
            //console.log("*************************-after", categoryName);
            console.log("*************************filmactor", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                var celebrityname;
                var keyMap;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    celebrityname = rows[i].name;
                    if (subCategory == "%sportscelpics%") {
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture1,
                                        "subtitle": rows[i].skill+","+ rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                          "subtitle": rows[i].skill+","+ rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture3,
                                          "subtitle": rows[i].skill+","+ rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture4,
                                        "subtitle": rows[i].skill+","+ rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }else if (subCategory == "%sportscelnetworth%") {
                        console.log("celebrity networth");
                        var msg = '' + rows[i].name + '’s net worth is believed to be around ' + rows[i].netWorth + '.';
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": msg,
                                        "image_url": rows[i].picture3,
                                        "subtitle": rows[i].name,
                                        // "buttons": [
                                        // // {
                                        // //     "type":"web_url",
                                        // //    "url": rows[i].picture5,
                                        // //    "title":"More Pics"
                                        // // }
                                        // // {
                                        // //   "type":"element_share"
                                        // // }
                                        // ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%sportscelnews%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].skill+","+ rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].newsUrl,
                                                "title": "Click for News"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%sportscelawards%") {
                        console.log("celebrity Family");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].awards,
                                        "image_url": rows[i].picture4,
                                        "subtitle": rows[i].name
                                        // "buttons": [
                                        // {
                                        //     "type":"web_url",
                                        //    "url": rows[i].picture5,
                                        //    "title":"More Pics"
                                        // }
                                        // ]
                                    }
                                ]
                            }
                        }
                      } else if (subCategory == "%sportscelcompetitors%") {
                          console.log("celebrity Family");
                          keyMap = {
                              "type": "template",
                              "payload": {
                                  "template_type": "generic",
                                  "elements": [
                                      {
                                          "title": rows[i].competitors,
                                          "image_url": rows[i].picture4,
                                          "subtitle": rows[i].name,
                                          // "buttons": [
                                          // {
                                          //     "type":"web_url",
                                          //    "url": rows[i].personalInfo,
                                          //    "title":"More Info"
                                          // }
                                          // ]
                                      }
                                  ]
                              }
                          }
                      }
                    //contentList.push(keyMap);
                }

                var messageData = {
                    "recipient": {
                        "id": senderID
                    },
                    "message": {
                        "attachment": keyMap,
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": celebrityname + ' ,%sportscelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": celebrityname + ' ,%sportscelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%sportscelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%sportscelnews%'
                            },{
                                "content_type": "text",
                                "title": "Competitors",
                                "payload": celebrityname + ' ,%sportscelcompetitors%'
                            }, {
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
            } else {
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
    sportsintro: sportsintro,
    sportscelbrityintro: sportscelbrityintro,
    sportsqrintro:sportsqrintro,
    sportscelebrityinfo:sportscelebrityinfo,
};

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
const fbRquest = require('./fbapi.js');
//var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});

var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';
const subcategorymovies = (event, categoryName) => {
    // var movie = moviename.replace(" %%","");
    //console.log("subcategorymovies", moviename);
    //var mname = moviename.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_movies_preference where subCategory = (select id from cc_subcategories where subCategoryName = ?) order by id desc', [categoryName], function(err, rows) {
            //console.log("********subcategorymovies*********", mname);
            //console.log("*************************-after", categoryName);
            console.log("*************************subcategorymovies", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                //var rowslenth;
                var contentList = [];
                // if (rows.length > 10) {
                //     rowslenth = 10;
                //     console.log("more than 10 Rows", rowslenth);
                // } else {
                //     rowslenth = rows.length;
                //     console.log("less than 10 Rows", rowslenth);
                // }

                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
                        //"item_url": rows[i].movieImageUrl,
                        "buttons": [//   {
                            //     "type": "web_url",
                            //     "url": rows[i].trailerUrl,
                            //     "title": "Trailer"
                            // },{
                            //     "type": "web_url",
                            //     "url": rows[i].movieDescriptionUrl,
                            //     "title": "Audio"
                            // },
                            {
                                "type": "postback",
                                "title": "More Info",
                                "payload": rows[i].movieName + ' %mname%'
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
                                "title": "Action",
                                "payload": 'Action,' + categoryName + ',%action%'
                            }, {
                                "content_type": "text",
                                "title": "Animation",
                                "payload": 'Animation,' + categoryName + ',%animation%'
                            }, {
                                "content_type": "text",
                                "title": "Comedy",
                                "payload": 'Comedy,' + categoryName + ',%comedy%'
                            }, {
                                "content_type": "text",
                                "title": "Romance",
                                "payload": 'Romance,' + categoryName + ',%romance%'
                            }, {
                                "content_type": "text",
                                "title": "Thriller",
                                "payload": 'Thriller,' + categoryName + ',%thriller%'
                            }, {
                                "content_type": "text",
                                "title": "Socio-fantasy",
                                "payload": 'Socio-fantasy,' + categoryName + ',%socio-fantasy%'
                            }, {
                                "content_type": "text",
                                "title": "Top 5 Movies of 2016",
                                "payload": 'Top 5 Movies of 2016,' + categoryName + ',%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Worst Movies of 2016",
                                "payload": 'Worst Movies of 2016,' + categoryName + ',%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Top 10 Songs of 2016",
                                "payload": 'Top 10 Songs of 2016,' + categoryName + ',%QR%'
                            }, {
                                "content_type": "text",
                                "title": "home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
            connection.release();
        });
    });
}


  const getmovies = (messagingEvent, moviename) => {
    // var movie = moviename.replace(" %%","");
    console.log("quickmovies", moviename);
    var mname = moviename.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_movies_preference where movieName= ?', [mname], function(err, rows) {
            console.log("********quickmovies*********", mname);
            //console.log("*************************-after", categoryName);
            console.log("*************************quickmovies", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                //var rowslenth;
                // if (rows.length > 10) {
                //     rowslenth = 10;
                //     console.log("more than 10 Rows", rowslenth);
                // } else {
                //     rowslenth = rows.length;
                //     console.log("less than 10 Rows", rowslenth);
                // }
                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
                        //"item_url": rows[i].movieImageUrl,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].trailerUrl,
                                "title": "Trailer"
                            }, {
                                "type": "web_url",
                                "url": rows[i].songsUrl,
                                "title": "Audio"
                            }, {
                                "type": "web_url",
                                "url": rows[i].reviews,
                                "title": "Review"
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
                                "title": rows[0].leadActor,
                                "payload": rows[0].leadActor + " %a%"
                            }, {
                                "content_type": "text",
                                "title": rows[0].leadActress,
                                "payload": rows[0].leadActress + " %a%"
                            }, {
                                "content_type": "text",
                                "title": rows[0].director,
                                "payload": rows[0].director + " %a%"
                            }, {
                                "content_type": "text",
                                "title": rows[0].musicDirector,
                                "payload": rows[0].musicDirector + " %a%"
                            }, {
                                "content_type": "text",
                                "title": "home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });
}


function sendHelpMessage(event) {
    //fbuserlocation();
    var userid = event.sender.id;
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        var username = userprofiledata.first_name;
        // console.log("--------:Response data:-------- ", JSON.stringify(body));
        // console.log("--------:Response data:--------first_name ", userprofiledata.first_name);
        // console.log("--------:Response data:--------last_name ", userprofiledata.last_name);
        // console.log("--------:Response data:--------locale ", userprofiledata.locale);
        // console.log("--------:Response data:-------- timezone", userprofiledata.timezone);
        // console.log("--------:Response data:--------gender ", userprofiledata.gender);

        //Random messages

        var errorString = "";

        while (errorString === "") {
            var random = Math.floor(Math.random() * errors.length);
            if (errors[random].error.length < 320) // better be a least one good joke :)
                errorString = errors[random].error;
            }

        //End Randum messages for Unable find the data what user types

        var senderID = event.sender.id;
        //var msg = 'I am sorry '+username+', my senses are gone wrong. Why dont you try a different command...';

        //var msg = 'Hey '+username+', How are you?';
        //console.log("--------:Response data:--------sendHelpMessage1", msg);
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
        //sendHelpMessageSecond(event, userid);
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
            //searchText.sendHelpMessageSecond(event, userid);

        } else {
            console.error("Unable to send message.");
            //console.error(response);
            console.error("Error while sending message:", error);
        }
    });
}





module.exports = {
    subcategorymovies: subcategorymovies
};

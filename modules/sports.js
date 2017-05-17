'use strict';
var request = require('request');
//const searchText = require('./search.js');
//const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
const jokes = require('../contentjson/jokes.json');
const fbRquest = require('./fbapi.js');
const dbpool = require('./mysqlconfig.js');
const googleSearch = require('./search.js');
//var app = express();
var mysql = require('mysql');
//var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});
var pool = dbpool.mysqlpool;
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';
var quickreply = [
    {
        "content_type": "text",
        "title": "Movies",
        "payload": "Movies",
        "image_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg"
    }, {
        "content_type": "text",
        "title": "Sports",
        "payload": "Sports",
        "image_url": "https://fankickdev.blob.core.windows.net/images/sports.jpg"
    }, {
        "content_type": "text",
        "title": "TV Shows",
        "payload": "TV Shows",
        "image_url": "https://fankickdev.blob.core.windows.net/images/celebrities.jpg"
    }, {
        "content_type": "text",
        "title": "Music",
        "payload": "Music",
        "image_url": "https://fankickdev.blob.core.windows.net/images/music.jpg"
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
//     setInterval(sportsqrdetails(messagingEvent, qrtitle){
//   console.log('Execute result in 3 sec');
// }, 3000);

// console.log('###############@@@@@@@@@@@@@Execute result in 3 sec%%%%%%%%%%%%%%%%%%%%%%$$$$$$$$$$$$$');
// setInterval(sportsqrdetails(messagingEvent, qrtitle), 13000);
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
    var msg = 'Here is what I know about ' + sportscelname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    console.log('###############@@@@@@@@@@@@@Execute result in 3 sec%%%%%%%%%%%%%%%%%%%%%%$$$$$$$$$$$$$');
    setInterval(sportscelbritydetails(messagingEvent, sportscelname), 60000);
    //sportscelbritydetails(messagingEvent, sportscelname);
    user_favorite_sports_celebrity(messagingEvent, sportscelname)
}

const sports_category_conversation = (event, category, sportsCelebrity) => {
    var senderID = event.sender.id;
    console.log("favoriteactorconversation:---", category);
    console.log("favoriteactorconversation:---", sportsCelebrity);
    var celebrityName;
    var description;
    var conversationQueue;
    var quickReply1;
    var quickReply2;
    var quickReply3;
   var  blockOneUrl
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_conversation_three where category = (select id from cc_categories where categoryName = ?) order by id desc', [category], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < 1; i++) {
                  celebrityName = rows[i].celebrityName;
                  description = rows[i].blockOneDescription;
                  quickReply1 = rows[i].blockOneName;
                  quickReply2 = rows[i].blockTwoName;
                  quickReply3 = rows[i].blockThreeName;
                  blockOneUrl = rows[i].blockOneUrl;
                }
                console.log(celebrityName, description, conversationQueue, quickReply1, quickReply2, quickReply3);
                var messageData = {
                    "recipient": {
                        "id": senderID
                    },
                    "message": {
                        "text": description,
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Fantastic!",
                                "payload": "Fantastic!," + celebrityName + "," + blockOneUrl + "," + quickReply2 + "," + quickReply3 + "," + description + ",1,%Fantastic!%",
                                "image_url": "https://www.smileysapp.com/emojis/ok-smiley.png"
                            }, {
                                "content_type": "text",
                                "title": "Is it? ",
                                "payload": "Is it?," + celebrityName + "," + blockOneUrl + "," + quickReply2 + "," + quickReply3 + "," + description + ",1,%Fantastic!%",
                                "image_url": "https://www.smileysapp.com/emojis/inspecting-smiley.png"
                            }, {
                                "content_type": "text",
                                "title": quickReply2,
                                "payload": quickReply2 + "," + celebrityName + "," + "blockTwoName ,%celebrity_conv2%"
                            }, {
                                "content_type": "text",
                                "title": quickReply3,
                                "payload": quickReply3 + "," + celebrityName + "," + "blockThreeName ,%celebrity_conv3%"
                            }, {
                                "content_type": "text",
                                "title": "Enough!",
                                "payload": "%Enough!%",
                                  "image_url": "https://www.smileysapp.com/emojis/not-listening.png"
                            }, {
                                "content_type": "text",
                                "title": "Latest in Movies",
                                "payload": "movies%%list%%"
                            }, {
                                "content_type": "text",
                                "title": "Latest in Sports",
                                "payload": "sports%%list%%"
                            }, {
                                "content_type": "text",
                                "title": "Latest in Music",
                                "payload": "music%%list%%"
                            },{
                                "content_type": "text",
                                "title": "Latest in Tv Shows",
                                "payload": "tv shows%%list%%"
                            }, {
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "jokes"
                            }
                        ]

                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else if (rows.length == 0) {
                //sportsmenu(event);
                //sportscelbritydetails(event, sportsCelebrity);
                sportsmenu(event);
            }
            connection.release();
        });
    });
}

function user_favorite_sports_celebrity(event, sportscelname) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set sportsCelebrity = ? where facebookId = ?', [
            sportscelname, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("Update the user favorite sports celebrity name database");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

function sportsmenu(messagingEvent) {
    var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_preference order by id desc', function(err, rows) {
            console.log("*************************sportsmenu", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                        "title": rows[i].title,
                        "image_url": rows[i].imageUrl,
                        "subtitle": rows[i].celebrity,
                        // "title":rows[i].title,
                        // "image_url":rows[i].imageUrl,
                        // "subtitle":rows[i].celebrity,
                        // "default_action": {
                        //   "type": "web_url",
                        //   "url": rows[i].imageUrl,
                        //   "messenger_extensions": true,
                        //   "webview_height_ratio": "tall",
                        //   "fallback_url": rows[i].imageUrl
                        // },
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "View More 🔍",
                                "payload": rows[i].quickReplyTitle + ' %sportsQRtitle%'
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
                                "title": "IPL 2017",
                                "payload": 'IPL 2017',
                                "image_url": "http://www.userlogos.org/files/logos/jumpordie/ipl-iphone.png"
                            }, {
                                "content_type": "text",
                                "title": "Sports Videos",
                                "payload": 'Sports Videos,sports,%QR%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/sports.jpg"
                            }, {
                                "content_type": "text",
                                "title": "Cricket Info",
                                "payload": 'Cricket Info,sports,%QR%',
                                "image_url": "https://lh4.ggpht.com/BIZV9ymUYC1m1j9aNSBFlT9AmQRrjyRMuxOYF6AbX2OgZLd3RbaiKiEriO_ORHJ7kBs=w300"
                            }, {
                                "content_type": "text",
                                "title": "Cricket Teams",
                                "payload": 'Cricket Teams,sports,%QR%',
                                "image_url": "https://lh4.ggpht.com/BIZV9ymUYC1m1j9aNSBFlT9AmQRrjyRMuxOYF6AbX2OgZLd3RbaiKiEriO_ORHJ7kBs=w300"
                            }, {
                                "content_type": "text",
                                "title": "Cricket Schedules",
                                "payload": 'Cricket Schedules,sports,%QR%',
                                "image_url": "https://lh4.ggpht.com/BIZV9ymUYC1m1j9aNSBFlT9AmQRrjyRMuxOYF6AbX2OgZLd3RbaiKiEriO_ORHJ7kBs=w300"
                            }, {
                                "content_type": "text",
                                "title": "Live Scores",
                                "payload": 'Live Scores,sports,%QR%',
                                "image_url": "https://lh4.ggpht.com/BIZV9ymUYC1m1j9aNSBFlT9AmQRrjyRMuxOYF6AbX2OgZLd3RbaiKiEriO_ORHJ7kBs=w300"
                            }, {
                                "content_type": "text",
                                "title": "Cricket Results",
                                "payload": 'Cricket Results,sports,%QR%',
                                "image_url": "https://lh4.ggpht.com/BIZV9ymUYC1m1j9aNSBFlT9AmQRrjyRMuxOYF6AbX2OgZLd3RbaiKiEriO_ORHJ7kBs=w300"
                            }, {
                                "content_type": "text",
                                "title": "Soccer Results",
                                "payload": 'Soccer Results,sports,%QR%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/sports.jpg"
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
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}

function sportsqrdetails(messagingEvent, qrtitle) {
    var qr1;
    var qr2;
    var qr3;
    var qr4;
    var qr5;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_preference where quickReplyTitle = ?', [qrtitle], function(err, rows) {
            console.log("*************************sportsmenu", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                                "title": "Proceed 👉"
                            }
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
                                "payload": qr1
                            }, {
                                "content_type": "text",
                                "title": qr2,
                                "payload": qr2 + ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr3,
                                "payload": qr3 + ' %sportscel%'
                            }, {
                                "content_type": "text",
                                "title": qr4,
                                "payload": qr4 + ',sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": qr5,
                                "payload": qr5 + ',sports,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Back To Sports 🏆",
                                "payload": "Sports"
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

function sportscelbritydetails(messagingEvent, sportscelname) {
    var event = messagingEvent;
    var quickList = [];
    var celname = sportscelname.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_celebrity_preference where name= ?', [celname], function(err, rows) {
            console.log("*************************sportscelebrity", rows);
            console.log("*************************sportscelebrity length", rows.length);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
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
                        "subtitle": rows[i].skill + "," + rows[i].country,
                        // "buttons": [
                        //     {
                        //         "type": "web_url",
                        //         "url": rows[i].personal,
                        //         "title": "About 👤"
                        //     }
                        // ]
                    };
                    contentList.push(keyMap);

                }
                var icon = 'http://4.bp.blogspot.com/-tJ00D3bRsPA/U5iB8P5vwMI/AAAAAAAAIyQ/-OPfILBWrR4/s1600/OMG-smiley.png';
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
                                "payload": name + ' ,%sportscelpics%',
                                "image_url": "http://icons.iconarchive.com/icons/harwen/simple/256/My-Pictures-icon.png"
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": name + ' ,%sportscelawards%',
                                "image_url": "http://amreli.atulmotors.com/images/trophy.png"
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": name + ' ,%sportscelnews%',
                                "image_url": "https://thumbs.dreamstime.com/x/news-icon-11187212.jpg"
                            }, {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": name + ' ,%sportscelgoogle%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/google.png"
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": name + ' ,%sportscelwiki%',
                                "image_url": "https://cdn3.iconfinder.com/data/icons/inficons-round-brand-set-2/512/wikipedia-512.png"
                            }, {
                                "content_type": "text",
                                "title": 'Sports Jokes',
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
            } else if (rows.length == 0) {
                googleSearch.googlegraph(celname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}

const sportscelebrityinfo = (messagingEvent, quickpayloadtext) => {
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    var sportmanname = actername.trim();
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_sports_celebrity_preference where name = ?', [sportmanname], function(err, rows) {
            console.log("********Sports person name*********", actername);
            //console.log("*************************-after", categoryName);
            console.log("*************************Sports person name", rows);
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
                                        "subtitle": rows[i].skill + "," + rows[i].country,
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
                                        "subtitle": rows[i].skill + "," + rows[i].country,
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
                                        "subtitle": rows[i].skill + "," + rows[i].country,
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
                                        "subtitle": rows[i].skill + "," + rows[i].country,
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
                    } else if (subCategory == "%sportscelnetworth%") {
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
                                        "subtitle": rows[i].skill + "," + rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].newsUrl,
                                                "title": "Click for News 📢"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%sportscelgoogle%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].skill + "," + rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].googleSearch,
                                                "title": "Click Here"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%sportscelwiki%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].skill + "," + rows[i].country,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].personal,
                                                "title": "Click Here"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%sportscelawards%") {
                        console.log("celebrity awards");
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
                        var competitor = rows[i].competitors;
                        var picurl = rows[i].picture2;
                        var name = rows[i].name;
                        competitorsofcelebrity(messagingEvent, competitor, picurl, name);
                        console.log("celebrity competitors");

                    }
                    //contentList.push(keyMap);
                }
                var icon = 'http://4.bp.blogspot.com/-tJ00D3bRsPA/U5iB8P5vwMI/AAAAAAAAIyQ/-OPfILBWrR4/s1600/OMG-smiley.png';
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
                                "payload": celebrityname + ' ,%sportscelpics%',
                                "image_url": "http://icons.iconarchive.com/icons/harwen/simple/256/My-Pictures-icon.png"
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": celebrityname + ' ,%sportscelawards%',
                                "image_url": "http://amreli.atulmotors.com/images/trophy.png"
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%sportscelnews%',
                                "image_url": "https://thumbs.dreamstime.com/x/news-icon-11187212.jpg"
                            }, {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": celebrityname + ' ,%sportscelgoogle%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/google.png"
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": celebrityname + ' ,%sportscelwiki%',
                                "image_url": "https://cdn3.iconfinder.com/data/icons/inficons-round-brand-set-2/512/wikipedia-512.png"
                            }, {
                                "content_type": "text",
                                "title": 'Sports Jokes',
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

function competitorsofcelebrity(messagingEvent, competitor, picurl, name) {
    var senderID = messagingEvent.sender.id;
    var genrearray = competitor.split(',');
    var name1 = genrearray[0];
    var name2 = genrearray[1];
    console.log(senderID, name1, name2, picurl, name);
    var keyMap = {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": name,
                    "image_url": picurl,
                    "subtitle": "Competitors of " + name
                }
            ]
        }
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
                    "title": name1,
                    "payload": name1 + ' %sportscel%'
                }, {
                    "content_type": "text",
                    "title": name2,
                    "payload": name2 + ' %sportscel%'
                }, {
                    "content_type": "text",
                    "title": "Back To Sports 🏆",
                    "payload": "Sports"
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

//function tvshowsinfo(messagingEvent, moviename)
const ipl = (categoryName, event) => {

    var senderID = event.sender.id;
    // //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    // //var msg = 'Amazing talent! Here is what I know about '+img+'';
    // var messageData = {
    //     "recipient": {
    //         "id": senderID
    //     },
    //     "message": {
    //         "text": "Will update soon"
    //         //"text":msg
    //     }
    //     // "message": {
    //     //     "attachment": {
    //     //         "type": "audio",
    //     //         "payload": {
    //     //             "url": "https://petersapparel.com/bin/clip.mp3"
    //     //         }
    //     //     }
    //     // }
    // };

    var keyMap = {
        "type": "template",
        "payload": {
            "template_type": "generic",
            "elements": [
                {
                    "title": "IPL 2017",
                    "image_url": 'https://livecrickethub.com/wp-content/uploads/2017/02/Vivo-IPL-2017-Auction.png',
                    "subtitle": "IPL 2017"
                }
            ]
        }
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
                    "title": "IPL 2017 Results",
                    "payload": 'IPL 2017 Results,sports,%QR%'
                }, {
                    "content_type": "text",
                    "title": "IPL 2017 Schedule",
                    "payload": 'IPL 2017 Schedule,sports,%QR%'
                }, {
                    "content_type": "text",
                    "title": "IPL 2017 Squads",
                    "payload": 'IPL 2017 Squads,sports,%QR%'
                }, {
                    "content_type": "text",
                    "title": "Back To Sports 🏆",
                    "payload": "Sports"
                }, {
                    "content_type": "text",
                    "title": "home 🏠",
                    "payload": "home"
                }
            ]
        }
    };

    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //sportsqrdetails(messagingEvent, qrtitle);
}


const sports_Fantastic_wow = (messagingEvent, quickpayloadtext, type) => {
    var queuearray = quickpayloadtext.split(',');
    var text = queuearray[0];
    var celName = queuearray[1];
    var url = queuearray[2];
    var qr1 = queuearray[3];
    var qr2 = queuearray[4];
    var dec = queuearray[5];
    var blockno = queuearray[6];
    var bno1;
    var bno2;
    console.log(celName);
    console.log(url);
    console.log(qr1);
    console.log(qr2);
    console.log(dec);
    console.log(blockno);

    if (type == "Fantastic") {
        if (blockno == 1) {
            bno1 = 2;
            bno2 = 3;
            console.log("bno1", bno1);
            console.log("bno1", bno2);
        } else if (blockno == 2) {
            bno1 = 1;
            bno2 = 3;
            console.log("bno1", bno1);
            console.log("bno1", bno2);
        } else if (blockno == 3) {
            bno1 = 1;
            bno2 = 2;
            console.log("bno1", bno1);
            console.log("bno1", bno2);
        }
        var senderID = messagingEvent.sender.id;
        //var description = 'Thanks, Hey you want to know about ' + celName + 'please select the below button';
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": celName,
                                "subtitle": dec,
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": url,
                                        "title": "Proceed 👉"
                                    }
                                ]
                            }
                        ]
                    }
                },
                //  "text": description,
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": qr1,
                        "payload": qr1 + ',' + celName + ',' + 'blockOneName ,%celebrity_conv' + bno1 + '%'
                    }, {
                        "content_type": "text",
                        "title": qr2,
                        "payload": qr2 + ',' + celName + ',' + 'blockOneName ,%celebrity_conv' + bno2 + '%'
                    }, {
                        "content_type": "text",
                        "title": "Latest in Movies",
                        "payload": "movies%%list%%"
                    }, {
                        "content_type": "text",
                        "title": "Latest in Sports",
                        "payload": "sports%%list%%"
                    }, {
                        "content_type": "text",
                        "title": "Latest in Music",
                        "payload": "music%%list%%"
                    },{
                        "content_type": "text",
                        "title": "Latest in Tv Shows",
                        "payload": "tv shows%%list%%"
                    }, {
                        "content_type": "text",
                        "title": "Jokes",
                        "payload": "jokes"
                    }
                ]

            }
        }
        fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
        //update_conversation_usercelebrity(messagingEvent);
    } else {
        console.log("No Data Found From Database");
        sendHelpMessage(messagingEvent);
    }
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
    sportsqrintro: sportsqrintro,
    sportscelebrityinfo: sportscelebrityinfo,
    ipl: ipl,
    sports_category_conversation: sports_category_conversation,
    sports_Fantastic_wow:sports_Fantastic_wow
};

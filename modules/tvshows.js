'use strict';
var request = require('request');
const searchText = require('./search.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
const jokes = require('../contentjson/jokes.json');
const fbRquest = require('./fbapi.js');
const dbpool = require('./mysqlconfig.js');
const googleSearch = require('./search.js');
var mysql = require('mysql');
//var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});
var pool = dbpool.mysqlpool;
var fbpage_access_token = process.env.FK_ACCESS_TOKEN;
var EntertainmentTvShows = require('../mongodb/schemas/Entertainment/EntertainmentTvShows');
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
const tvshowinfo = (messagingEvent, tvshowname) => {
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
        //     "message": {
        //         "attachment": {
        //           "type":"video",
        // "payload":{
        //   "url":"https://www.youtube.com/watch?v=XpAaOER_6iY"
        // }
        //         }
        //     }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvshowsdetails(messagingEvent, tvshowname);
}

const tvcelbrityintro = (event, celbrityname) => {
    var senderID = event.sender.id;
    var msg = 'Interesting! Here is what I know about ' + celbrityname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvcelbritydetails(event, celbrityname);
}

const tvshowsintro = (messagingEvent, tvshowsmsg) => {
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
    tvshowsmenu(messagingEvent);
}
const tvcelebrityinfo = (messagingEvent, quickpayloadtext) => {
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_tvshows_celebrity_preference where name = ?', [actername], function(err, rows) {
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
                    if (subCategory == "%tvcelpics%") {
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture1,
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
                    } else if (subCategory == "%tvcelnetworth%") {
                        console.log("celebrity networth");
                        var msg = '' + rows[i].name + '’s net worth is believed to be around ' + rows[i].netWorth + '.';
                        // ’s net worth is believed to be around _____
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
                    } else if (subCategory == "%tvcelnews%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].name,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].news,
                                                "title": "Click for News 📢"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%tvcelgoogle%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].name,
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
                    } else if (subCategory == "%tvcelwiki%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].name,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].personalInfo,
                                                "title": "Click Here"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%tvcelawards%") {
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
                                "payload": celebrityname + ' ,%tvcelpics%',
                                "image_url": "http://icons.iconarchive.com/icons/harwen/simple/256/My-Pictures-icon.png"
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": celebrityname + ' ,%tvcelawards%',
                                "image_url": "http://amreli.atulmotors.com/images/trophy.png"
                            }, {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": celebrityname + ' ,%tvcelgoogle%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/google.png"
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": celebrityname + ' ,%tvcelwiki%',
                                "image_url": "https://cdn3.iconfinder.com/data/icons/inficons-round-brand-set-2/512/wikipedia-512.png"
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%tvcelnews%',
                                "image_url": "https://thumbs.dreamstime.com/x/news-icon-11187212.jpg"
                            }, {
                                "content_type": "text",
                                "title": "TV Shows Jokes",
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

const gettvshowsgenre = (messagingEvent, quickpayloadtext) => {
    var tvgenrearray = quickpayloadtext.split(',');
    var tvgenrename = tvgenrearray[0];
    var subCategory = tvgenrearray[1];
    console.log("Tvgenrename", tvgenrename);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_tvshows where subCategory =(select id from cc_subcategories where subCategoryName= ?) order by id desc', [tvgenrename], function(err, rows) {
            console.log("*************************tvshowsmenu", rows);
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
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "More Info ℹ",
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
                                "title": "Romantic Comedy",
                                "payload": 'Romantic Comedy'
                            }, {
                                "content_type": "text",
                                "title": "Reality",
                                "payload": 'Reality'
                            }, {
                                "content_type": "text",
                                "title": "Horror / Crime",
                                "payload": 'Horror / Crime'
                            }, {
                                "content_type": "text",
                                "title": "Watch TV Shows",
                                "payload": 'Watch TV Shows,tv shows,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "TV Shows Jokes",
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


const tvShows_conversation = (event, category, favtvshows) => {
    var senderID = event.sender.id;
    console.log("favoriteactorconversation:---", category);
    console.log("favoriteactorconversation:---", favtvshows);
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
                tvshowsmenu(event);
            }
            connection.release();
        });
    });
}


function tvcelbritydetails(event, celbrityname) {
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        connection.query('select * from cc_tvshows_celebrity_preference where name = ?', [celbrityname], function(err, rows) {
            console.log("***Tv Show celebrity details:", rows);
            console.log("***Tv Show celebrity details length:", rows.length);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                var senderID = event.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);

                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var name = rows[i].name;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].skill,
                        //  "item_url": rows[i].image_url,
                        // "buttons": [
                        //     {
                        //         "type": "web_url",
                        //         "url": rows[i].personalInfo,
                        //         "title": "About 👤"
                        //     }, {
                        //         "type": "web_url",
                        //         "url": rows[i].googleSearch,
                        //         "title": "Search in Google 🔎"
                        //     }, {
                        //         "type": "web_url",
                        //         "url": rows[i].news,
                        //         "title": "News 📰"
                        //     }
                        //]
                    };
                    contentList.push(keyMap);
                    //  movieslist = rows[i].lastFiveMovies;
                    //  console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%", movieslist);
                }
                //var myarray = movieslist.split(',');
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
                                "payload": name + ' ,%tvcelpics%',
                                "image_url": "http://icons.iconarchive.com/icons/harwen/simple/256/My-Pictures-icon.png"
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": name + ' ,%tvcelawards%',
                                "image_url": "http://amreli.atulmotors.com/images/trophy.png"
                            }, {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": name + ' ,%tvcelgoogle%',
                                "image_url": "https://fankickdev.blob.core.windows.net/images/google.png"
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": name + ' ,%tvcelwiki%',
                                "image_url": "https://cdn3.iconfinder.com/data/icons/inficons-round-brand-set-2/512/wikipedia-512.png"
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": name + ' ,%tvcelnews%',
                                "image_url": "https://thumbs.dreamstime.com/x/news-icon-11187212.jpg"
                            }, {
                                "content_type": "text",
                                "title": "TV Shows Jokes",
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
                googleSearch.googlegraph(celbrityname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

function tvshowsmenu(messagingEvent) {
    // pool.getConnection(function(err, connection) {
    //     connection.query('select  * from cc_tvshows order by id desc', function(err, rows) {
    //         console.log("*************************tvshowsmenu", rows);
    //         if (err) {
    //             console.log("Error While retriving content pack data from database:", err);
    //         } else if (rows.length) {
    //             var senderID = messagingEvent.sender.id;
    //             var contentList = [];
    //             if (rows.length > 10) {
    //                 var rowslenth = 10;
    //                 console.log("more than 10 Rows", rowslenth);
    //             } else {
    //                 var rowslenth = rows.length;
    //                 console.log("less than 10 Rows", rowslenth);
    //             }
    //             for (var i = 0; i < rowslenth; i++) { //Construct request body
    //                 var keyMap = {
    //                     "title": rows[i].name,
    //                     "image_url": rows[i].picture1,
    //                     "buttons": [
    //                         {
    //                             "type": "postback",
    //                             "title": "More Info ℹ",
    //                             "payload": rows[i].name + ' %tvshows%'
    //                         }
    //                     ]
    //                 };
    //                 contentList.push(keyMap);
    //             }
    //             var messageData = {
    //                 "recipient": {
    //                     "id": senderID
    //                 },
    //                 "message": {
    //                     "attachment": {
    //                         "type": "template",
    //                         "payload": {
    //                             "template_type": "generic",
    //                             "elements": contentList
    //                         }
    //                     },
    //                     "quick_replies": [
    //                         {
    //                             "content_type": "text",
    //                             "title": "Romantic Comedy",
    //                             "payload": 'Romantic Comedy'
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "Reality",
    //                             "payload": 'Reality'
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "Horror / Crime",
    //                             "payload": 'Horror / Crime'
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "Watch TV Shows",
    //                             "payload": 'Watch TV Shows,tv shows,%QR%'
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "TV Shows Jokes",
    //                             "payload": "Jokes"
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "Home 🏠",
    //                             "payload": "home"
    //                         }
    //                     ]
    //                 }
    //             }
    //             fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //         } else {
    //             console.log("No Data Found From Database");
    //             sendHelpMessage(messagingEvent);
    //         }
    //         connection.release();
    //     });
    // });
      EntertainmentTvShows.find({}, function (err, data) {
                console.log("*************************tvshowsmenu", data);
                if (err) {
                    console.log("Error While retriving content pack data from database:", err);
                } else if (data.length) {
                    var senderID = messagingEvent.sender.id;
                    var contentList = [];
                    if (rows.length > 10) {
                        var rowslenth = 10;
                        console.log("more than 10 Rows", rowslenth);
                    } else {
                        var rowslenth = data.length;
                        console.log("less than 10 Rows", rowslenth);
                    }
                    for (var i = 0; i < rowslenth; i++) { //Construct request body
                        var keyMap = {
                            "title": data[i].showName,
                            "image_url": data[i].tvShowsImageUrl1,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "More Info ℹ",
                                    "payload": data[i].showName + ' %tvshows%'
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
                                    "title": "Romantic Comedy",
                                    "payload": 'Romantic Comedy'
                                }, {
                                    "content_type": "text",
                                    "title": "Reality",
                                    "payload": 'Reality'
                                }, {
                                    "content_type": "text",
                                    "title": "Horror / Crime",
                                    "payload": 'Horror / Crime'
                                }, {
                                    "content_type": "text",
                                    "title": "Watch TV Shows",
                                    "payload": 'Watch TV Shows,tv shows,%QR%'
                                }, {
                                    "content_type": "text",
                                    "title": "TV Shows Jokes",
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


}

function tvshowsdetails(messagingEvent, tvshowname) {
  user_favorite_tvshow(messagingEvent, tvshowname);
    var tvshowname = tvshowname.trim();
    var tvshowleadActor;
    var tvshowleadActress;
    console.log("tvshowname:", tvshowname);

    pool.getConnection(function(err, connection) {
        connection.query('select  * from cc_tvshows where name = ?', [tvshowname], function(err, rows) {
            console.log("*************************tvshowsdetails", rows);
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
                    tvshowleadActor = rows[i].leadActor;
                    tvshowleadActress = rows[i].leadActress;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].clips,
                                "title": "Clips"
                            }, {
                                "type": "web_url",
                                "url": rows[i].googleSearch,
                                "title": "About"
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
                                "title": tvshowleadActor,
                                "payload": tvshowleadActor + ' %tvcel%'
                            }, {
                                "content_type": "text",
                                "title": tvshowleadActress,
                                "payload": tvshowleadActress + ' %tvcel%'
                            }, {
                                "content_type": "text",
                                "title": "TV Shows Jokes",
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


function user_favorite_tvshow(messagingEvent, tvshowname) {
    var senderID = messagingEvent.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set fevTvShows = ? where facebookId = ?', [
            tvshowname, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("Update the user favorite tv shows name database");
                //sendHelpMessage(event);
                //sendImageMessage(event);
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
    tvshowsintro: tvshowsintro,
    tvshowinfo: tvshowinfo,
    tvcelbrityintro: tvcelbrityintro,
    tvcelebrityinfo: tvcelebrityinfo,
    gettvshowsgenre: gettvshowsgenre,
    tvShows_conversation:tvShows_conversation
};

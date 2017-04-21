'use strict';
var request = require('request');
const searchText = require('./search.js');
//const thread = require('./thread.js');
const imdb = require('imdb-api');
var googleTrends = require('google-trends-api');
var wikipedia = require("node-wikipedia");
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
        "title": "Movies 🎬",
        "payload": "Movies"
    }, {
        "content_type": "text",
        "title": "Sports 🏆",
        "payload": "Sports"
    }, {
        "content_type": "text",
        "title": "TV Shows 📺",
        "payload": "TV Shows"
    }, {
        "content_type": "text",
        "title": "Music 🎶",
        "payload": "Music"
    }
];

const musicalbams = (categoryName, event) => {
    var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_albums where subCategory = (select id from cc_subcategories where subCategoryName= ?) order by id desc', [categoryName], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                                "type": "web_url",
                                "url": rows[i].albumUrl,
                                "title": "Play Album 🎧"
                            }, {
                                "type": "postback",
                                "title": "View More 🔍",
                                "payload": rows[i].name + " %albumname%"
                            }
                            //,{
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
                                "title": "Top 50 Songs",
                                "payload": 'Top 50 Songs,' + categoryName + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Music Videos",
                                "payload": 'Music Videos,' + categoryName + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Hindi Albums",
                                "payload": "Hindi"
                            }, {
                                "content_type": "text",
                                "title": "Telugu Albums",
                                "payload": "Telugu"
                            }, {
                                "content_type": "text",
                                "title": "Tamil Albums",
                                "payload": "Tamil"
                            }, {
                                "content_type": "text",
                                "title": "Kannada Albums",
                                "payload": "Kannada"
                            }, {
                                "content_type": "text",
                                "title": "Music Jokes",
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
        connection.query('select * from cc_music_albums where name = ?', [albumname], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                                "title": "Play Album 🎧"
                            },
                            {
                                "type": "postback",
                                "title": "View More 🔍",
                                "payload": rows[i].name + " %albumname%"
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
                                "title": name,
                                "payload": name + " %musicartist%"
                            }, {
                                "content_type": "text",
                                "title": "Music Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Back To Music 🎶",
                                "payload": "Music"
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
                sendHelpMessage(event);
            }
            connection.release();
        });
    });
}

const languagealbamsinfo = (categoryName, event) => {
    language_wise_albams(categoryName, event);
    user_preferd_language(categoryName, event);
    //var event = messagingEvent;
    // var quickList = [];
    // var name;
    // pool.getConnection(function(err, connection) {
    //     connection.query('select * from cc_music_albums where language = ? order by releaseDate desc', [categoryName], function(err, rows) {
    //         console.log("*************************Data For Music Albams", rows);
    //         if (err) {
    //             console.log("Error While retriving content pack data from database:", err);
    //         } else if (rows.length) {
    //             var senderID = event.sender.id;
    //             var contentList = [];
    //             if (rows.length > 10) {
    //                 var rowslenth = 10;
    //                 console.log("more than 10 Rows", rowslenth);
    //             } else {
    //                 var rowslenth = rows.length;
    //                 console.log("less than 10 Rows", rowslenth);
    //             }
    //             for (var i = 0; i < rowslenth; i++) { //Construct request body
    //                 name = rows[i].artist;
    //                 var keyMap = {
    //                     "title": rows[i].name,
    //                     "image_url": rows[i].picture1,
    //                     "subtitle": rows[i].artist,
    //                     "buttons": [
    //                         {
    //                             "type": "web_url",
    //                             "url": rows[i].albumUrl,
    //                             "title": "Play Album 🎧"
    //                         }
    //                     ]
    //                 };
    //                 contentList.push(keyMap);
    //
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
    //                             "title": "Music Jokes",
    //                             "payload": "Jokes"
    //                         }, {
    //                             "content_type": "text",
    //                             "title": "Back To Music 🎶",
    //                             "payload": "Music"
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
    //             sendHelpMessage(event);
    //         }
    //         connection.release();
    //     });
    // });
}

const language_conversation = (event, language) => {
    language_wise_albams(language, event);
}

const musiccelbrityintro = (messagingEvent, musiccelname) => {
    var senderID = messagingEvent.sender.id;
    var msg = 'Here is what I know about ' + musiccelname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    music_celbrity_details(messagingEvent, musiccelname);
    user_favorite_music_celebrity(messagingEvent, musiccelname)
}

function language_wise_albams(language, event) {
    //var event = messagingEvent;
    var quickList = [];
    var name;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_albums where language = ? order by releaseDate desc', [language], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                                "title": "Play Album 🎧"
                            },{
                                "type": "postback",
                                "title": "View More 🔍",
                                "payload": rows[i].name + " %albumname%"
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
                                "title": "Hindi Albums",
                                "payload": "Hindi"
                            }, {
                                "content_type": "text",
                                "title": "Telugu Albums",
                                "payload": "Telugu"
                            }, {
                                "content_type": "text",
                                "title": "Tamil Albums",
                                "payload": "Tamil"
                            }, {
                                "content_type": "text",
                                "title": "Kannada Albums",
                                "payload": "Kannada"
                            }, {
                                "content_type": "text",
                                "title": "Music Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Back To Music 🎶",
                                "payload": "Music"
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
                sendHelpMessage(event);
            }
            connection.release();
        });
    });
}

function user_preferd_language(categoryName, event) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set language = ? where facebookId = ?', [
            categoryName, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("No Data Found From Database");
                console.log("Updated the user language into the preferences");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

function user_favorite_music_celebrity(event, musiccelname) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set musicCelebrity = ? where facebookId = ?', [
            sportscelname, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("No Data Found From Database");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

function music_celbrity_details(messagingEvent, musiccelname) {
    var event = messagingEvent;
    var quickList = [];
    var name;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_celebrity_preference where name = ?', [musiccelname], function(err, rows) {
            console.log("*************************Data For Music Celebrity", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
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
                    name = rows[i].name;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].skill,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].personal,
                                "title": "About 👤"
                            }, {
                                "type": "web_url",
                                "url": rows[i].googleSearch,
                                "title": "Google Search 🔎"
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
                                "title": "Pictures",
                                "payload": name + ' ,%musiccelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": name + ' ,%musiccelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": name + ' ,%musiccelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": name + ' ,%Musiccelnews%'
                            }, {
                                "content_type": "text",
                                "title": "Popular Albums",
                                "payload": name + ' ,%Musiccelalbums%'
                            }, {
                                "content_type": "text",
                                "title": "Popular Songs",
                                "payload": name + ' ,%Musiccelsongs%'
                            }, {
                                "content_type": "text",
                                "title": "Competitors",
                                "payload": name + ' ,%Musiccelcomp%'
                            }, {
                                "content_type": "text",
                                "title": "Music Jokes",
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
                googleSearch.googlegraph(musiccelname, event);
                //wikipediadetails(musiccelname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
            connection.release();
        });
    });
}

const musiccelebrityinfo = (messagingEvent, quickpayloadtext) => {
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_celebrity_preference where name = ?', [actername], function(err, rows) {
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
                    if (subCategory == "%musiccelpics%") {
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture1,
                                        "subtitle": rows[i].skill,
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
                                        "subtitle": rows[i].skill,
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
                                        "subtitle": rows[i].skill,
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
                                        "subtitle": rows[i].skill,
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
                    } else if (subCategory == "%musiccelnetworth%") {
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
                                        "subtitle": rows[i].name
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%Musiccelnews%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].skill,
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
                    } else if (subCategory == "%musiccelawards%") {
                        console.log("celebrity awards");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].awards,
                                        "image_url": rows[i].picture3,
                                        "subtitle": rows[i].name
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%Musiccelalbums%") {
                        var name = rows[i].name;
                        var event = messagingEvent;
                        celebrityalbams(event, name);
                        // console.log("celebrity Family");
                        // keyMap = {
                        //     "type": "template",
                        //     "payload": {
                        //         "template_type": "generic",
                        //         "elements": [
                        //             {
                        //                 "title": rows[i].name,
                        //                 "image_url": rows[i].picture2,
                        //                 "subtitle": rows[i].popularAlbums
                        //             }
                        //         ]
                        //     }
                        // }
                    } else if (subCategory == "%Musiccelsongs%") {
                        console.log("celebrity songs");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].popularSongs
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%Musiccelcomp%") {
                        console.log("celebrity competitors");
                        var competitor = rows[i].competitors;
                        var picurl = rows[i].picture2;
                        var name = rows[i].name;
                        competitorsofcelebrity(messagingEvent, competitor, picurl, name);
                        // keyMap = {
                        //     "type": "template",
                        //     "payload": {
                        //         "template_type": "generic",
                        //         "elements": [
                        //             {
                        //                 "title": rows[i].competitors,
                        //                 "image_url": rows[i].picture2,
                        //                 "subtitle": rows[i].name
                        //             }
                        //         ]
                        //     }
                        // }
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
                                "payload": celebrityname + ' ,%musiccelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": celebrityname + ' ,%musiccelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%musiccelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%Musiccelnews%'
                            }, {
                                "content_type": "text",
                                "title": "Popular Albums",
                                "payload": celebrityname + ' ,%Musiccelalbums%'
                            }, {
                                "content_type": "text",
                                "title": "Popular Songs",
                                "payload": celebrityname + ' ,%Musiccelsongs%'
                            }, {
                                "content_type": "text",
                                "title": "Competitors",
                                "payload": celebrityname + ' ,%Musiccelcomp%'
                            }, {
                                "content_type": "text",
                                "title": "Music Jokes",
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

function celebrityalbams(event, name) {
    //var event = messagingEvent;
    var quickList = [];
    var name;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_music_albums where artist = ? order by releaseDate desc', [name], function(err, rows) {
            console.log("*************************Data For Music Albams", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
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
                                "title": "Play Album 🎧"
                            },{
                                "type": "postback",
                                "title": "View More 🔍",
                                "payload": rows[i].name + " %albumname%"
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
                                "title": "Music Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Back To Music 🎶",
                                "payload": "Music"
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
                sendHelpMessage(event);
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
                    "payload": name1 + ' %musicartist%'
                }, {
                    "content_type": "text",
                    "title": name2,
                    "payload": name2 + ' %musicartist%'
                }, {
                    "content_type": "text",
                    "title": "Back To Music 🎶",
                    "payload": "Music"
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

function wikipediadetails(categoryName, event) {
    wikipedia.page.data(categoryName, {
        content: true
    }, function(response) {
        console.log("wikipediadetails", response); // structured information on the page for Clifford Brown (wikilinks, references, categories, etc.)
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
    albuminfo: albuminfo,
    musiccelbrityintro: musiccelbrityintro,
    musiccelebrityinfo: musiccelebrityinfo,
    languagealbamsinfo: languagealbamsinfo,
    language_conversation: language_conversation
};

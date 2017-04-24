'use strict';
var request = require('request');
const searchText = require('./search.js');
//const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
const movie = require('../contentjson/movies.json');
const sport = require('../contentjson/sports.json');
const tv_show = require('../contentjson/tv shows.json');
const musics = require('../contentjson/music.json');
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
const subcategorymovies = (event, categoryName) => {
    // var movie = moviename.replace(" %%","");
    //console.log("subcategorymovies", moviename);
    //var mname = moviename.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_movies_preference where subCategory = (select id from cc_subcategories where subCategoryName = ?) order by releaseDate desc', [categoryName], function(err, rows) {
            //console.log("********subcategorymovies*********", mname);
            //console.log("*************************-after", categoryName);
            console.log("*************************subcategorymovies", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var rowslenth;
                var contentList = [];
                if (rows.length > 10) {
                    rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }

                for (var i = 0; i < rowslenth; i++) { //Construct request body
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
                                "title": "More Info ℹ",
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
                                "title": "Baahubali 2 Trailer",
                                "payload": 'Baahubali 2 Trailer,' + categoryName + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Top 5 Movies",
                                "payload": 'Top 5 Movies,' + categoryName + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Worst Movies",
                                "payload": 'Worst Movies,' + categoryName + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Action",
                                "payload": 'Action,' + categoryName + ',%action%'
                            }, {
                                "content_type": "text",
                                "title": "Drama",
                                "payload": 'Drama,' + categoryName + ',%drama%'
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
                var rowslenth;
                if (rows.length > 10) {
                    rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }
                for (var i = 0; i < rowslenth; i++) { //Construct request body
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
                                "payload": rows[0].musicDirector + ' %musicartist%'
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
const getgenremovies = (messagingEvent, quickpayloadtext) => {
    //cont moviesgenre(messagingEvent, quickpayloadtext) {
    console.log("*********Movies Genre***********", quickpayloadtext);
    // var genre;
    // var subCategory;
    var genrearray = quickpayloadtext.split(',');
    var genre = genrearray[0];
    var subCategory = genrearray[1];
    console.log("Genre", genre);
    console.log("SubCategory", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_movies_preference where subCategory = (select id from cc_subcategories where subCategoryName = ?) and genre = ? order by releaseDate desc', [
            subCategory, genre
        ], function(err, rows) {
            console.log("*************************moviesgenre", rows);
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
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
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
                                "title": "More Info ℹ",
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
                                "title": "Baahubali 2 Trailer",
                                "payload": 'Baahubali 2 Trailer,' + subCategory + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Latest News",
                                "payload": 'Latest News,' + subCategory + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Upcoming Movies",
                                "payload": 'Upcoming Movies,' + subCategory + ',%QRsub%'
                            }, {
                                "content_type": "text",
                                "title": "Action",
                                "payload": 'Action,' + subCategory + ',%action%'
                            }, {
                                "content_type": "text",
                                "title": "Drama",
                                "payload": 'Drama,' + subCategory + ',%drama%'
                            }, {
                                "content_type": "text",
                                "title": "Comedy",
                                "payload": 'Comedy,' + subCategory + ',%comedy%'
                            }, {
                                "content_type": "text",
                                "title": "Romance",
                                "payload": 'Romance,' + subCategory + ',%romance%'
                            }, {
                                "content_type": "text",
                                "title": "Thriller",
                                "payload": 'Thriller,' + subCategory + ',%thriller%'
                            }, {
                                "content_type": "text",
                                "title": "Socio-fantasy",
                                "payload": 'Socio-fantasy,' + subCategory + ',%socio-fantasy%'
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

// const selectedactorcomptiters = (messagingEvent, celebrityname) => {
//
//
// }

const filmactor = (messagingEvent, actorname)=> {
    console.log("filmactor", actorname);
    var event = messagingEvent;
    var aname = actorname.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_film_celebrity_preference where name = ?', [aname], function(err, rows) {
            console.log("********filmactor*********", aname);
            //console.log("*************************-after", categoryName);
            console.log("*************************filmactor", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                var celebrityname;
                //  "payload": celebrityid + ' ,%movies%'
                var celebrityid;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var res1 = rows[i].id + ",";
                    var res2 = rows[i].celebrityName + ",";
                    var res3 = res2.concat(res1);
                    var res5 = res3.concat(res2);
                    celebrityname = rows[i].name;
                    celebrityid = rows[i].id;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].name,
                        //  "item_url": rows[i].image_url,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].facebookHandle,
                                "title": "Facebook"
                            }, {
                                "type": "web_url",
                                "url": rows[i].twitterHandle,
                                "title": "Twitter"
                            }
                        ]
                    };
                    contentList.push(keyMap);
                }
                updateusercelebrity(celebrityname, senderID);
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
                                "payload": celebrityname + ' ,%pictures%'
                            }, {
                                "content_type": "text",
                                "title": "Movies",
                                "payload": celebrityname + ' ,%movies%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "Competitors",
                                "payload": celebrityname + ' ,%Moviecomp%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%news%'
                            }, {
                                "content_type": "text",
                                "title": "Family",
                                "payload": celebrityname + ' ,%family%'
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
                googleSearch.googlegraph(aname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });
}


const conversation_filmactor = (messagingEvent, actorname)=> {
    console.log("conversation_filmactor", actorname);
    var event = messagingEvent;
    var aname = actorname.trim();
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_film_celebrity_preference where name = ?', [aname], function(err, rows) {
            console.log("********conversation_filmactor*********", aname);
            //console.log("*************************-after", categoryName);
            console.log("*************************conversation_filmactor", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                var celebrityname;
                var competitors;
                //  "payload": celebrityid + ' ,%movies%'
                var celebrityid;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var res1 = rows[i].id + ",";
                    var res2 = rows[i].celebrityName + ",";
                    var res3 = res2.concat(res1);
                    var res5 = res3.concat(res2);
                    competitors = rows[i].competitors;
                    celebrityname = rows[i].name;
                    celebrityid = rows[i].id;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].name,
                        //  "item_url": rows[i].image_url,
                        "buttons": [
                          {
                              "type": "postback",
                              "title": celebrityname,
                              "payload": celebrityname + " %a%"
                          }
                            // {
                            //     "type": "web_url",
                            //     "url": rows[i].facebookHandle,
                            //     "title": "Facebook"
                            // }, {
                            //     "type": "web_url",
                            //     "url": rows[i].twitterHandle,
                            //     "title": "Twitter"
                            // }
                        ]
                    };
                    contentList.push(keyMap);
                }
              //  updateusercelebrity(celebrityname, senderID);
              update_conversation_usercelebrity(messagingEvent);
                var genrearray = competitor.split(',');
                var name1 = genrearray[0];
                var name2 = genrearray[1];
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
                              "title": name1,
                              "payload": name1 + " %a%"
                          },{
                              "content_type": "text",
                              "title": name2,
                              "payload": name2 + " %a%"
                          }, {
                              "content_type": "text",
                              "title": "Bollywood",
                              "payload": "Bollywood"
                          }, {
                              "content_type": "text",
                              "title": "Tollywood",
                              "payload": "Tollywood"
                          }, {
                              "content_type": "text",
                              "title": "Kollywood",
                              "payload": "Kollywood"
                          }, {
                              "content_type": "text",
                              "title": "Malayalam Cinema",
                              "payload": "Malayalam Cinema"
                          }, {
                              "content_type": "text",
                              "title": "Kannada Cinema",
                              "payload": "Kannada Cinema"
                          }, {
                              "content_type": "text",
                              "title": "Jokes",
                              "payload": "jokes"
                          },{
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else if (rows.length == 0) {
                googleSearch.googlegraph(aname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });
}

function update_conversation_usercelebrity(messagingEvent) {
  var senderID = messagingEvent.sender.id;
    //console.log("******************categoryName*************", usercelebrityName);
    //console.log("******************senderID*************", senderID);
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set movieCelebrity = null where facebookId = ?', [
            senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                //console.log("No Data Found From Database");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}






function updateusercelebrity(usercelebrityName, senderID) {
    //console.log("******************categoryName*************", usercelebrityName);
    //console.log("******************senderID*************", senderID);
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set movieCelebrity= ? where facebookId=?', [
            usercelebrityName, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                //console.log("No Data Found From Database");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}


const selectedactorfilems = (messagingEvent, celebrityname) => {
    console.log("*********Movies Genre***********", celebrityname);
    pool.getConnection(function(err, connection) {
        connection.query('select  * from cc_movies_preference where leadActor= ? order by releaseDate desc', [celebrityname], function(err, rows) {
            console.log("*************************selectedactorfilems", rows);
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
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
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
                                "title": "More Info ℹ",
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
                                "title": "About",
                                "payload": celebrityname + ' ,%about%'
                            }, {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": celebrityname + ' ,%pictures%'
                            }, {
                                "content_type": "text",
                                "title": "Movies",
                                "payload": celebrityname + ' ,%movies%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%news%'
                            }, {
                                "content_type": "text",
                                "title": "Family",
                                "payload": celebrityname + ' ,%family%'
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

const actressfilms = (messagingEvent, celebrityname) => {
    console.log("*********Movies Genre***********", celebrityname);
    //var actortype = type;
    var mname = celebrityname.trim();
    //console.log(actortype);
    console.log(mname);
    //var query = 'select * from cc_movies_preference where leadActress = ? order by releaseDate desc';
    //console.log(query);
    pool.getConnection(function(err, connection) {
        //if (actortype = "leadActress") {}
        connection.query('select * from cc_movies_preference where leadActress = ? order by releaseDate desc', [mname], function(err, rows) {
            console.log("*************************selectedactorfilems", rows);
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
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
                        "subtitle": mname,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "More Info ℹ",
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
                                "title": "About",
                                "payload": celebrityname + ' ,%about%'
                            }, {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": celebrityname + ' ,%pictures%'
                            }, {
                                "content_type": "text",
                                "title": "Movies",
                                "payload": celebrityname + ' ,%movies%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%news%'
                            }, {
                                "content_type": "text",
                                "title": "Family",
                                "payload": celebrityname + ' ,%family%'
                            }, {
                                "content_type": "text",
                                "title": "Tollywood",
                                "payload": "Tollywood"
                            },
                            {
                                "content_type": "text",
                                "title": "Bollywood",
                                "payload": "Bollywood"
                            },{
                                "content_type": "text",
                                "title": "Kollywood",
                                "payload": "kollywood"
                            },{
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

const directorfilms = (messagingEvent, celebrityname) => {
    console.log("*********Movies Genre***********", celebrityname);
    //var actortype = type;
    var mname = celebrityname.trim();
  //  console.log(actortype);
    console.log(mname);
    //var query = 'select * from cc_movies_preference where leadActress = ? order by releaseDate desc';
    //console.log(query);
    pool.getConnection(function(err, connection) {
        //if (actortype = "leadActress") {}
        connection.query('select * from cc_movies_preference where director = ? order by releaseDate desc', [mname], function(err, rows) {
            console.log("*************************selectedactorfilems", rows);
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
                        "title": rows[i].movieName,
                        "image_url": rows[i].picture1,
                        "subtitle": mname,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "More Info ℹ",
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
                                "title": "About",
                                "payload": celebrityname + ' ,%about%'
                            }, {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": celebrityname + ' ,%pictures%'
                            }, {
                                "content_type": "text",
                                "title": "Movies",
                                "payload": celebrityname + ' ,%movies%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%news%'
                            }, {
                                "content_type": "text",
                                "title": "Family",
                                "payload": celebrityname + ' ,%family%'
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
    subcategorymovies: subcategorymovies,
    getmovies: getmovies,
    getgenremovies: getgenremovies,
    selectedactorfilems: selectedactorfilems,
    actressfilms: actressfilms,
    directorfilms: directorfilms,
    filmactor:filmactor,
    conversation_filmactor:conversation_filmactor
};

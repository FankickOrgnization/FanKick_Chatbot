'use strict';
var request = require('request');
const googleSearch = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
var cricapi = require("node-cricapi");
const errors = require('../contentjson/errormsg.json');
const movie = require('../contentjson/movies.json');
const sport = require('../contentjson/sports.json');
const tv_show = require('../contentjson/tv shows.json');
const musics = require('../contentjson/music.json');
const jokes = require('../contentjson/jokes.json');
const dbpool = require('./mysqlconfig.js');
const tvshows = require('./tvshows.js');
const sports = require('./sports.js');
const movies = require('./movies.js');
const music = require('./music.js');
const fbRquest = require('./fbapi.js');
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

const sendContentPacks = (categoryName, event) => {
    console.log("*************---categoryName----*******", categoryName);
    if (categoryName == "get started") {
        var senderID = event.sender.id;
        //thread.persistentMenu(fbpage_access_token);
        fbuserdetails(event, senderID);
        console.log("categoryName", categoryName);
    } else if (categoryName == "hi" || categoryName == "hello" || categoryName == "hey") {
        //wishing_message(categoryName, event);
        user_intrest_category(event, categoryName);
    } else if (categoryName == "movies") {
        user_intrest_movies_category(event, categoryName);
        //submenu(event, categoryName);
        usercategory(event, categoryName);
        console.log("enter into the allcategory function");
    } else if (categoryName == "sports") {
        user_intrest_sports_category(event, categoryName);
        //submenu(event, categoryName);
        usercategory(event, categoryName);
        console.log("enter into the allcategory function");
    } else if (categoryName == "tv shows") {
        //userintresttvshowssubcategory(event, categoryName);
        submenu(event, categoryName);
        usercategory(event, categoryName);
        console.log("enter into the allcategory function");
    } else if (categoryName == "music") {
        //user_intrest_music_category(event, categoryName);
        submenu(event, categoryName);
        usercategory(event, categoryName);
        console.log("enter into the allcategory function");
    } else if (categoryName == "indian" || categoryName == "western") {
        user_intrest_music_category(event, categoryName);
        //music.musicalbams(categoryName, event);
        usersubcategory(event, categoryName);
    } else if (categoryName == "hindi" || categoryName == "telugu" || categoryName == "tamil" || categoryName == "kannada") {
        music.languagealbamsinfo(categoryName, event);

    } else if (categoryName == "reality" || categoryName == "romantic comedy" || categoryName == "horror / crime" || categoryName == "cooking" || categoryName == "animation") {
        //wishing_message(categoryName, event);
        tvshows.gettvshowsgenre(event, categoryName);
        usersubcategory(event, categoryName);
    } else if (categoryName == "hollywood" || categoryName == "tollywood" || categoryName == "bollywood" || categoryName == "kollywood" || categoryName == "malayalam cinema" || categoryName == "kannada cinema") {
        //subcategorydetails(categoryName,event);
        movies.subcategorymovies(event, categoryName);
        usersubcategory(event, categoryName);
    } else if (categoryName == "cricket" || categoryName == "soccer" || categoryName == "tennis" || categoryName == "badminton") {
        usersubcategory(event, categoryName);
        subcategorydetails(categoryName, event);
    } else if (categoryName == "home") {
        allcategory(event, categoryName);
    } else if (categoryName == "jokes") {
        sendJoke(categoryName, event);
    } else if (categoryName == "ipl 2017" || categoryName == "ipl") {
        sports.ipl(categoryName, event);
    } else if (categoryName == "pics") {
        imagedisplay(categoryName, event);
    } else if (categoryName == "videos") {
        videodisplay(categoryName, event);
    } else if (categoryName == "location") {
        adduserlocation(categoryName, event);
    }else if (categoryName == "list") {
        list_view(categoryName, event);
    } else if (categoryName == 518003 || categoryName == 500045) {
        getuserlocation(categoryName, event);
    } else {
        sendHelpMessage(event);
    }
}


function list_view(categoryName, event){
var senderID = event.sender.id;
var messageData = {
  "recipient":{
    "id": senderID
  }, "message": {
    "attachment": {
        "type": "template",
        "payload": {
            "template_type": "list",
            "elements": [
                {
                    "title": "Classic T-Shirt Collection",
                    "image_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                    "subtitle": "See all our colors",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                        "messenger_extensions": true,
                        "webview_height_ratio": "tall",
                        "fallback_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg"
                    },
                    "buttons": [
                        {
                            "title": "View",
                            "type": "web_url",
                            "url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                            "messenger_extensions": true,
                            "webview_height_ratio": "tall",
                            "fallback_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg"
                        }
                    ]
                },
                {
                    "title": "Classic White T-Shirt",
                    "image_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                    "subtitle": "100% Cotton, 200% Comfortable",
                    "default_action": {
                        "type": "web_url",
                        "url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                        "messenger_extensions": true,
                        "webview_height_ratio": "tall",
                        "fallback_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg"
                    },
                    "buttons": [
                        {
                            "title": "Shop Now",
                            "type": "web_url",
                            "url": "https://fankickdev.blob.core.windows.net/images/movies.jpg",
                            "messenger_extensions": true,
                            "webview_height_ratio": "tall",
                            "fallback_url": "https://fankickdev.blob.core.windows.net/images/movies.jpg"
                        }
                    ]
                }
            ],
             "buttons": [
                {
                    "title": "View More",
                    "type": "postback",
                    "payload": "payload"
                }
            ]
        }
    }
}

}

fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');

}



function user_intrest_category(event, categoryName) {
    var senderID = event.sender.id;
    var category;
    var subCategory;
    var movieCelebrity;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_user_preference where facebookId= ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < rows.length; i++) {
                    category = rows[i].category;
                    subCategory = rows[i].subCategory;
                    movieCelebrity = rows[i].movieCelebrity;
                    console.log("category:-", category);
                    console.log("subCategory:-", subCategory);
                }

                if (category == null) {
                    wishing_message(categoryName, event);
                } else if (category != null) {
                    //Category_conversation(event, category);
                    //submenu(event, category);
                    userintrest_intro_message(category, event);
                }
            }
            connection.release();
        });
    });
}

function userintrest_intro_message(category, event) {
    var senderID = event.sender.id;
    //var category = "home";
    var msg = 'Hello dear, last time when you came, you were browsing ' + category + '. You like to continue? Shall I serve something else?';
    console.log("--------:Response data:--------msg1 ", msg);
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg,
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Yes 🙂",
                    "payload": category
                }, {
                    "content_type": "text",
                    "title": "No 😗",
                    "payload": "Home"
                }
            ]

        }
    }
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //allcategory(event, category);
}

function Category_conversation(event, category) {
    var senderID = event.sender.id;
    console.log("subCategoryconversation:---", category);
    var category;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_conversation_two where subCategory=(select id from cc_categories where categoryName= ? ) order by id desc', [category], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < 1; i++) {
                    category = rows[i].category;
                    console.log("Categoryconversation number:---", category);
                }

                if (category == 1) {
                    var categoryName = "sports";
                    submenu(event, categoryName);
                } else if (category == 2) {
                    var categoryName = "movies";
                    submenu(event, categoryName);
                } else if (category == 3) {
                    var categoryName = "music";
                    submenu(event, categoryName);
                } else if (category == 4) {
                    var categoryName = "tv shows";
                    submenu(event, categoryName);
                }
                // console.log(celebrityName);
                // console.log(description);
                // console.log(conversationQueue);
                // console.log(quickReply1);
                // console.log(quickReply2);
                // console.log(quickReply3);
                // var messageData = {
                //     "recipient": {
                //         "id": senderID
                //     },
                //     "message": {
                //         "text": description,
                //         "quick_replies": [
                //             {
                //                 "content_type": "text",
                //                 "title": quickReply1,
                //                 "payload": quickReply1 + '%conv%'
                //             }, {
                //                 "content_type": "text",
                //                 "title": quickReply2,
                //                 "payload": quickReply2 + '%conv%'
                //             }, {
                //                 "content_type": "text",
                //                 "title": quickReply2,
                //                 "payload": quickReply2 + '%conv%'
                //             }, {
                //                 "content_type": "text",
                //                 "title": "Skip",
                //                 "payload": category
                //             }
                //         ]
                //
                //     }
                // }
                // fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else if (rows.length == 0) {
                wishing_message(categoryName, event);
            }
            connection.release();
        });
    });
}

//user_intrest_music_subcategory(event, categoryName);

function user_intrest_movies_category(event, categoryName) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        //connection.query('select * from cc_celebrity_preference where subCategory = ?',[categoryName],function(err, rows) {
        connection.query('select * from cc_user_preference where facebookId= ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                // var senderID = event.sender.id;
                // var contentList = [];
                // var quickList = [];
                //  var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < rows.length; i++) {
                    var category = rows[i].category;
                    var subCategory = rows[i].subCategory;
                    var movieCelebrity = rows[i].movieCelebrity;
                    console.log("category:-", category);
                    console.log("subCategory:-", subCategory);
                    console.log("movieCelebrity:-", rows[i].movieCelebrity);
                    console.log("language:-", rows[i].language);
                    console.log("location:-", rows[i].location);
                }

                if (category = "movies") {
                    // if (subCategory != null && movieCelebrity == null) {
                    //       movies_categor_conversation(event, subCategory);
                    //     }else
                    if (movieCelebrity != null) {
                        movies_celebrity_conversation(event, subCategory, movieCelebrity);
                    } else if (movieCelebrity == null) {
                        submenu(event, categoryName);
                    }

                }

            }
            connection.release();
        });
    });
}

function user_intrest_music_category(event, categoryName) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        var category;
        var subCategory;
        //var sportsCelebrity = rows[i].sportsCelebrity;
        var language;
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        //connection.query('select * from cc_celebrity_preference where subCategory = ?',[categoryName],function(err, rows) {
        connection.query('select * from cc_user_preference where facebookId= ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                // var senderID = event.sender.id;
                // var contentList = [];
                // var quickList = [];
                //  var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < rows.length; i++) {
                    var category = rows[i].category;
                    var subCategory = rows[i].subCategory;
                    //var sportsCelebrity = rows[i].sportsCelebrity;
                    var language = rows[i].language;
                    console.log("category:-", category);
                    console.log("subCategory:-", subCategory);
                    console.log("language:-", language);
                    // console.log("language:-", rows[i].language);
                    // console.log("location:-", rows[i].location);
                }
                if (category == null || language == null) {
                    console.log("music_____________", category, language);
                    music.musicalbams(categoryName, event);
                    //  music_conversation_intro(event, categoryName, language);
                } else if (category != null && language != null) {
                    if (categoryName == "indian" || categoryName == "western") {
                        console.log("music_____________", categoryName, language);
                        music_conversation_intro(event, categoryName, language);
                    } else {
                        submenu(event, categoryName);
                    }
                }
            } else if (rows.length == 0) {
                submenu(event, categoryName);

            }
            connection.release();
        });
    });

}

function music_conversation_intro(event, categoryName, language) {
    var senderID = event.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    var msg = 'Hey, as far as my memory goes, you were browsing ' + language + ' albums. Wanna continue? Or else would you like to taste something else?';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //music.musicalbams(categoryName, event);
    music.languagealbamsinfo(language, event)
}

function user_intrest_sports_category(event, categoryName) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        //connection.query('select * from cc_celebrity_preference where subCategory = ?',[categoryName],function(err, rows) {
        connection.query('select * from cc_user_preference where facebookId= ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                // var senderID = event.sender.id;
                // var contentList = [];
                // var quickList = [];
                //  var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < rows.length; i++) {
                    var category = rows[i].category;
                    var subCategory = rows[i].subCategory;
                    var sportsCelebrity = rows[i].sportsCelebrity;
                    console.log("category:-", category);
                    console.log("subCategory:-", subCategory);
                    console.log("movieCelebrity:-", sportsCelebrity);
                    // console.log("language:-", rows[i].language);
                    // console.log("location:-", rows[i].location);
                }
                if (category == null && sportsCelebrity == null) {
                    submenu(event, categoryName);
                } else if (category != null && sportsCelebrity != null) {
                    if (category == "sports") {
                        sports.sports_celebrity_conversation(event, category, sportsCelebrity);
                    } else {
                        submenu(event, categoryName);
                    }
                }
            } else if (rows.length == 0) {
                submenu(event, categoryName);
            }
            connection.release();
        });
    });

}

function movies_categor_conversation(event, subCategory) {
    var senderID = event.sender.id;
    console.log("subCategoryconversation:---", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_conversation_two where subCategory=(select id from cc_subcategories where subCategoryName= ? ) order by id desc', [subCategory], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < rows.length; i++) {
                    celebrityName = rows[i].celebrityName;
                    description = rows[i].description;
                    conversationQueue = rows[i].conversationQueue;
                    quickReply1 = rows[i].quickReply1;
                    quickReply2 = rows[i].quickReply2;
                    quickReply3 = rows[i].quickReply3;
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
                                "title": quickReply1,
                                "payload": quickReply1 + '%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": quickReply2,
                                "payload": quickReply2 + '%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": quickReply3,
                                "payload": quickReply3 + '%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": "Skip",
                                "payload": subCategory
                            }
                        ]

                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else if (rows.length == 0) {}
            connection.release();
        });
    });
}

function movies_celebrity_conversation(event, subCategory, movieCelebrity) {
    var senderID = event.sender.id;
    var contentList = [];
    console.log("favoriteactorconversation:---", subCategory);
    console.log("favoriteactorconversation:---", movieCelebrity);
    var celebrityName;
    var description;
    var conversationQueue;
    var quickReply1;
    var quickReply2;
    var quickReply3;
    var storyUrl;
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_conversation_two where celebrityName= ? order by id', [movieCelebrity], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {

                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < 1; i++) {
                    celebrityName = rows[i].celebrityName;
                    description = rows[i].description;
                    conversationQueue = rows[i].conversationQueue;
                    storyUrl = rows[i].storyUrl;
                    quickReply1 = rows[i].quickReply1;
                    quickReply2 = rows[i].quickReply2;
                    quickReply3 = rows[i].quickReply3;
                    // var keyMap = {
                    //     "title": celebrityName,
                    //     //"image_url": rows[i].picture1,
                    //     "subtitle":description,
                    //     "buttons": [
                    //         {
                    //             "type": "web_url",
                    //             "url": rows[i].storyUrl,
                    //             "title": " Continue Reading ⏩"
                    //         }
                    //     ]
                    // };
                    // contentList.push(keyMap);
                }
                console.log(celebrityName);
                console.log(description);
                console.log(conversationQueue);
                console.log(quickReply1);
                console.log(quickReply2);
                console.log(quickReply3);
                var messageData = {
                    "recipient": {
                        "id": senderID
                    },
                    "message": {
                        "text": description,
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": quickReply1,
                                "payload": quickReply1 + ',' + celebrityName + ',' + storyUrl + ',' + description + ',%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": quickReply2,
                                "payload": quickReply2 + ',' + celebrityName + ',' + storyUrl + ',' + description + ',%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": quickReply3,
                                "payload": quickReply3 + ',' + celebrityName + ',' + storyUrl + ',' + description + ',%movie_conv%'
                            }, {
                                "content_type": "text",
                                "title": celebrityName,
                                "payload": celebrityName + " %a%"
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
                            }
                        ]

                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else if (rows.length == 0) {
                var categoryName = "movies";
                //submenu(event, categoryName);
                moviecelebrity_conversation_intro(event, movieCelebrity);
            }
            connection.release();
        });
    });
}

function moviecelebrity_conversation_intro(messagingEvent, actorname) {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    var msg = 'I am trying to guess the name of your favorite star, 🤔 mmmm.... it is ' + actorname + '. Am I right? If you are looking for someone else, pls key in your favorite actor...';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    movies.conversation_filmactor(messagingEvent, actorname);
}

function imagedisplay(categoryName, event) {
    var senderID = event.sender.id;
    var msg = 'Amazing talent👏! Here is what I know about ' + categoryName + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://33.media.tumblr.com/fe09465871326254116e18217f00e58c/tumblr_nra3xlkVYz1tq73owo1_500.gif"
                }
            },
            "quick_replies": quickreply
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //celebritymovies(messagingEvent, moviename);
    //  celebritiesdetails(categoryName, event);
}

function videodisplay(categoryName, event) {
    var senderID = event.sender.id;
    var msg = 'Amazing talent👏! Here is what I know about ' + categoryName + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "attachment": {
                "type": "video",
                "payload": {
                    "url": "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
                    //"url": "https://www.facebook.com/cnn/videos/vl.1074656819284548/10156412943866509/?type=1"
                }
            },
            "quick_replies": quickreply
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    //celebritymovies(messagingEvent, moviename);
    //  celebritiesdetails(categoryName, event);
}

function getuserlocation(categoryName, event) {
    console.log("*************---categoryName----*******", categoryName);
    var contentList = [];
    var quickList = [];

    var userid = event.sender.id;
    var url = 'http://maps.googleapis.com/maps/api/geocode/json?address=' + categoryName;

    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'
    }, function(error, response, body) {
        console.log("***********error", error);
        var locationdata = JSON.parse(response.body);
        var locationresults = locationdata.results;
        var locationstatus = locationdata.status;
        var len = locationresults.length;
        console.log("--------:googlegraphdetails Response data itemListElement:-------- ", len);
        console.log("--------:googlegraphdetails Response data status:--------", locationstatus);
        console.log("--------:googlegraphdetails Response data result:-------- ", locationresults);

        //var len2 = locationresults.length;
        var address = locationresults.length;
        console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address);
        for (var i = 0; address <= 1; i++) {
            console.log(locationresults[i]);
        }
        // console.log("--------:googlegraphdetails Response data itemListElement:-------- ", locationresults[1].address_components);
        // console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[1].long_name);
        // console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[1].short_name);
        // console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[2].long_name);
        //  console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[2].short_name);
        //  console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[3].long_name);
        //  console.log("--------:googlegraphdetails Response data itemListElement:-------- ", address[3].short_name);

        //var rows = userprofiledata.itemListElement;
        //  var rowlen = rows.length;
        //console.log("--------:Response data:--------length ", rowlen);
        //var senderID = event.sender.id;
        //var imagedata;
        //var desdata;
        // for (var i = 0; i < 1; i++) {
        //
        //   var name = rows[i].result.name;
        //   var articleBody = rows[i].result.detailedDescription.articleBody;
        //   //var contentUrl = rows[i].result.image.contentUrl;
        //   var url = rows[i].result.detailedDescription.url;
        //   console.log("googlegraphdetails.name",name);
        //   console.log("googlegraphdetails.articleBody",articleBody);
        // //  console.log("googlegraphdetails.contentUrl",contentUrl);
        //   console.log("googlegraphdetails.image.url",url);
        //
        //
        //     var keyMap = {
        //         "title": rows[i].result.name,
        //       //  "image_url": rows[i].result.image.contentUrl,
        //         "subtitle": rows[i].result.detailedDescription.articleBody,
        //         "buttons": [
        //             {
        //                 "type": "web_url",
        //                 "url": rows[i].result.detailedDescription.url,
        //                 "title": "Read More"
        //             }
        //         ]
        //     };
        //     contentList.push(keyMap);
        // }

        // var messageData = {
        //     "recipient": {
        //         "id": senderID
        //     },
        //     "message": {
        //         "attachment": {
        //             "type": "template",
        //             "payload": {
        //                 "template_type": "generic",
        //                 "elements": contentList
        //             }
        //         },
        //         "quick_replies": quickreply
        //     }
        // }
        //fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    });
}

function allcategory(event, categoryName) {
    var senderID = event.sender.id;
    var imgdangol = 'http://t3.gstatic.com/images?q=tbn:ANd9GcQIXnFlBKGWT1ByyIu3qfxX6opQX6BmeeU_qsiE3X8rX9ZRr63r';
    try {
        categoryName = "../contentjson/" + categoryName;
        var json = require(categoryName);
        var fullMessage = {
            recipient: {
                id: senderID
            }
        };
        fullMessage.message = json;
        fbRquest.callFBAPI(fullMessage, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    } catch (e) {
        console.log("error in sendSingleJsonMessage " + e.message + " " + categoryName + " " + fullMessage);
    }
}

//function subcategorymovies(categoryName, event)
// end get movies from the DB **************************

//subcategorydetails*************************************************************************
function subcategorydetails(categoryName, event) {
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        //connection.query('select * from cc_celebrity_preference where subCategory = ?',[categoryName],function(err, rows) {
        connection.query('select * from cc_celebrity_preference where subCategory=(select id from cc_subcategories where subCategoryName= ? ) order by id desc', [categoryName], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                var quickList = [];
                //  var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);

                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var res1 = rows[i].id + ",";
                    var res2 = rows[i].celebrityName + ",";
                    var res3 = res2.concat(res1);
                    var res5 = res3.concat(res2);
                    var keyMap = {
                        "title": rows[i].celebrityName,
                        "image_url": rows[i].celebrityImageUrl,
                        "subtitle": rows[i].description,
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
                            }, {
                                "type": "postback",
                                "title": "More Info ℹ",
                                "payload": rows[i].id
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
                        "quick_replies": quickreply
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

//subcategorydetails end *********************************************
//Random Jokes for User
function sendJoke(categoryName, event) {
    var senderID = event.sender.id;
    var jokeString = "";

    while (jokeString === "") {
        var random = Math.floor(Math.random() * jokes.length);
        if (jokes[random].joke.length < 320) // better be a least one good joke :)
            jokeString = jokes[random].joke;
        }

    var messageData = {
        recipient: {
            id: senderID
        },
        message: {
            text: jokeString,
            quick_replies: [
                {
                    "content_type": "text",
                    "title": "Another 😂",
                    "payload": "jokes"
                }, {
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
            ]
        }
    };

    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
}

//Ramndom Jokes for User*************

function sendHelpMessage(event) {
    var categoryName = "home";
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
            //"quick_replies": quickreply
        }
    }
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    allcategory(event, categoryName);
}

// const fbuserdetails = (event,userid) =>{
function fbuserdetails(event, userid) {
    var categoryName;
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    //var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=id,name,location,hometown&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userfbdata = JSON.parse(response.body);
        var userfname = userfbdata.first_name;
        var userlname = userfbdata.last_name;

        //var userFullName = userfname + userlname;
        var userFullName = userfname.concat( userlname);
        console.log(userFullName, "This is suser ");
        //console.log("--------:Response data:-------- ", JSON.stringify(body));
        // console.log("--------:Response data:--------first_name ", userfbdata.first_name);
        // console.log("--------:Response data:--------last_name ", userfbdata.last_name);
        // console.log("--------:Response data:--------locale ", userfbdata.locale);
        // console.log("--------:Response data:-------- timezone", userfbdata.timezone);
        // console.log("--------:Response data:--------gender ", userfbdata.gender);
        //console.log("--------:Response data:--------age_range ", userfbdata.age_range);
        var senderID = event.sender.id;
        // pool.getConnection(function(err, connection) {
        //   connection.query('SELECT * fk_pack_fanclub where name=?',[categoryName], function(err, rows) {
        //       if (err) {
        //           console.log("Error While retriving content pack data from database:", err);
        //       } else {
        //           console.log("No Data Found From Database");
        //           sendHelpMessage(event);
        //           //sendImageMessage(event);
        //       }
        //       connection.release();
        //   });
        //   });
        //
        pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO cc_user_preference(facebookId, firstName, lastName, fullName, gender, locale, timeZone)VALUES(?,?,?,?,?,?,?)', [
                senderID,
                userfname,
                userlname,
                userFullName,
                userfbdata.gender,
                userfbdata.locale,
                userfbdata.timezone
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
        //
        //     pool.getConnection(function(err, connection) {
        //       connection.query('update cc_user_preference set language="Telugu" where facebookId=?',[senderID], function(err, rows) {
        //           if (err) {
        //               console.log("Error While retriving content pack data from database:", err);
        //           } else {
        //               console.log("No Data Found From Database");
        //               //sendHelpMessage(event);
        //               //sendImageMessage(event);
        //           }
        //           connection.release();
        //       });
        //       });

        //fbuserlocation();
        //var msg = 'Hi '+username+', A lot of exciting things are awaiting for you! Get kicking!';
        //var msg = 'Hi '+username+'! My name is Kicker.\n How may I come of any help to you today?';
        //var msg = 'Hi '+username+'! My name is Kicker.\n \nI can help you get closer to your favorite celebrity with a lot of exciting things about them.\n\n Choose what excites you more';
        var msg = 'Hey Frannd!! Glad to see you! If you want to hang out for a while... These preferences will not keep you waiting! Choose a Category and eyewitness the Entertainment Buzzer';
        //var msg = 'Happy to See you 🙂 Entertainment is the new Joy. Fix and Click on a Preference from the menu and get trippy with it.';
        console.log("--------:Response data:--------msg1 ", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message": {
                "text": msg,
                // "quick_replies": [
                //     {
                //         "content_type": "text",
                //         "title": "Movies 🎬",
                //         "payload": "Movies"
                //     }, {
                //         "content_type": "text",
                //         "title": "Sports 🏆",
                //         "payload": "Sports"
                //     }, {
                //         "content_type": "text",
                //         "title": "Music 🎶",
                //         "payload": "Music"
                //     }, {
                //         "content_type": "text",
                //         "title": "TV Shows 📺",
                //         "payload": "TV Shows"
                //     }
                //     // ,
                //     // {
                //     //   "content_type":"text",
                //     //   "title":"What can you do?",
                //     //   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                //     // }
                // ]

            }
        }
        fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
        categoryName = "home";
        allcategory(event, categoryName)
        //test(senderID);
        //fbuserdetailsSecond(event, userid);
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            //console.error(response);
            console.error("Error while sending message:", error);
        }
    });

}

function usercategory(event, categoryName) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set category = ? where facebookId = ?', [
            categoryName, senderID
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

function wishing_message(categoryName, event) {
    var senderID = event.sender.id;
    var category = "home";

    //var msg = 'Welcome to the club! \n \nEntertainment is served here, order your preferences…';
    var msg = "Welcome to the ocean of entertainment🏟🎢! Mark your favorite spots, I'd like to take you for boating...";
    console.log("--------:Response data:--------msg1 ", msg);
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg,
            // "quick_replies": [
            //     {
            //         "content_type": "text",
            //         "title": "Movies 🎬",
            //         "payload": "Movies"
            //     }, {
            //         "content_type": "text",
            //         "title": "Sports 🏆",
            //         "payload": "Sports"
            //     }, {
            //         "content_type": "text",
            //         "title": "Music 🎶",
            //         "payload": "Music"
            //     }, {
            //         "content_type": "text",
            //         "title": "TV Shows 📺",
            //         "payload": "TV Shows"
            //     }
            //     // ,
            //     // {
            //     //   "content_type":"text",
            //     //   "title":"What can you do?",
            //     //   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            //     // }
            // ]

        }
    }
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    allcategory(event, category);
}

//Random messages for the main Categories
function submenu(event, categoryName) {
    var senderID = event.sender.id;
    var submenuname = categoryName.replace(" ", "_");
    //console.log("***********************", submenuname);
    var subname = submenuname.trim();
    var quickList = [];
    var submenuString = "";
    while (submenuString === "") {
        {
            if(subname == "movies") {
                //console.log("***********************", submenuname);
                var random = Math.floor(Math.random() * movie.length);
                if (movie[random].movies.length < 320)
                    submenuString = movie[random].movies;
                submemuquickreply(event, categoryName, submenuString);
            } else if (subname == "sports") {
                //console.log("***************subname*********************", subname);
                var random = Math.floor(Math.random() * sport.length);
                if (sport[random].sports.length < 320) // better be a least one good joke :)
                    submenuString = sport[random].sports;

                //submemuquickreply(event, categoryName, submenuString);
                sports.sportsintro(event, submenuString);
            } else if (subname == "music") {
                //console.log("***************subname*********************", subname);
                var random = Math.floor(Math.random() * musics.length);
                if (musics[random].music.length < 320) // better be a least one good joke :)
                    submenuString = musics[random].music;
                submemuquickreply(event, categoryName, submenuString);
            } else if (subname == "tv_shows") {
                //console.log("***************subname*********************", subname);
                var random = Math.floor(Math.random() * tv_show.length);
                if (tv_show[random].tv_shows.length < 320) // better be a least one good joke :)
                    submenuString = tv_show[random].tv_shows;

                //tvshows.tvshowsmenu(event, categoryName, submenuString);
                tvshows.tvshowsintro(event, submenuString);
            }
        }
    } //var msg = 'I am sorry '+username+', my senses are gone wrong. Why dont you try a different command...';

    //var msg = 'Hey '+username+', How are you?';
    //console.log("--------:Response data:--------sendHelpMessage1", msg);

}

function submemuquickreply(event, categoryName, submenuString) {
    var senderID = event.sender.id;
    var quickList = [];
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_subcategories where categoryId = (select id from cc_categories where categoryName = ?)', [categoryName], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                //  var senderID = event.sender.id;
                var quickList = [];
                console.log("*******************subcategory data*************", rows);
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    console.log(rows[i].subCategoryName);
                    var moviearray = {
                        "content_type": "text",
                        "title": rows[i].subCategoryName,
                        "payload": rows[i].subCategoryName
                    }
                    quickList.push(moviearray);
                    // contentList.push(keyMap);
                    // movieslist = rows[i].lastFiveMovies;
                    // console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%",movieslist);
                }

                var messageData = {
                    "recipient": {
                        "id": senderID
                    },
                    "message": {
                        "text": submenuString,
                        "quick_replies": quickList
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

//Ended the Random messages for the main Categories
function userlocation(event, categoryName) {
    var senderID = event.sender.id;
    var userloca;
    pool.getConnection(function(err, connection) {
        connection.query('select location from cc_user_preference where facebookId = ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("***********No Data Found From Database*********", rows[0].location);
                userloca = rows[0].location;
                console.log("***********No Data Found From Database*********userloca", userloca);
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
            console.log("*******************User location Null****************", userloca);
            //usercategory(event, categoryName)
            adduserlocation(event, userloca, categoryName);
        });
    });
}

function usersubcategory(event, categoryName) {
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set subcategory = ? where facebookId = ?', [
            categoryName, senderID
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

function adduserlocation(categoryName, event) {
    console.log("*********************adduserlocation***********************1", categoryName);

    var senderID = event.sender.id;
    console.log("*********************adduserlocation***********************2", senderID);
    var msg = 'Let us know your zipcode, we wanna offer you the best and the most relevant!';
    console.log("--------:Response data:--------msg1 ", msg);
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg,
            "quick_replies": [
                {
                    "content_type": "location"
                }, {
                    "content_type": "text",
                    "title": "skip",
                    "payload": "home"
                }
            ]

        }
    }
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');

}

function findlocation(event) {
    console.log("findlocation");
    var senderID = event.sender.id;
    pool.getConnection(function(err, connection) {
        connection.query('SELECT language from cc_user_preference where facebookId=?', [senderID], function(err, rows) {
            console.log("Result for language", rows);
            console.log("Result for language", rows[0].language);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("No Data Found From Database");
                //  sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

// function fbRquest.callFBAPI(body, url) {
//     console.log("url", url);
//     console.log("Body", body);
//     request({
//         uri: url,
//         qs: {
//             access_token: fbpage_access_token
//         },
//         method: 'POST',
//         json: body,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     }, function(error, response, body) {
//         console.log("Response data: ", JSON.stringify(body));
//         if (!error && response.statusCode == 200) {
//             var recipientId = body.recipient_id;
//             var messageId = body.message_id;
//             console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
//         } else {
//             console.error("Unable to send message.");
//             //console.error(response);
//             console.error("Error while sending message:", error);
//         }
//     });
// }

function fbuserlocation() {
    //var url = 'https://geoip-db.com/json/';
    var url = 'http://ipinfo.io';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        console.log("Successfully find the location", userprofiledata);

    });
}

module.exports = {
    sendContentPacks: sendContentPacks,
    //  movies_Queue_title_details:movies_Queue_title_details
    //fbuserdetails:fbuserdetails,
    // name:name,
    //  quickMenu: quickMenu
};

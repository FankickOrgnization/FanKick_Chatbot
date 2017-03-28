var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cricapi = require("node-cricapi");
const fetch = require('node-fetch');
const crypto = require('crypto');
//const thread = require('./modules/thread.js');
const payloadText = require('./modules/payload.js');
const googleSearch = require('./modules/search.js');
const movies = require('./modules/movies.js');
const fbRquest = require('./modules/fbapi.js');
var googleTrends = require('google-trends-api');
const tvshows = require('./modules/tvshows.js');
const sports = require('./modules/sports.js');
const music = require('./modules/music.js');
const errors = require('./contentjson/errormsg.json');
//const bot = require('./wit.js');

var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});

var quickMenu = [
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

app.use(bodyParser.json());
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';

var quickMenu = payloadText.quickMenu;

app.get('/webhook', function(req, res) {
    //console.log("Validating webhook", console.log(JSON.stringify(req.body)));
    console.log("######################################", res);
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'login_type') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/webhook', function(req, res) {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function(pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            console.log("Page Entry Details:", JSON.stringify(pageEntry));
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function(messagingEvent) {
                if (messagingEvent.optin) {
                    //receivedAuthentication(messagingEvent);
                } else if (messagingEvent.message) {
                    if (!messagingEvent.message.hasOwnProperty('is_echo')) { // Avoiding multiple database fetches
                        //receivedMessage(messagingEvent);
                        if (messagingEvent.message.quick_reply == undefined) {
                            console.log("1messaging quick_reply payload:------", messagingEvent.message.text);
                            receivedMessage(messagingEvent);
                        } else {
                            console.log("2messaging quick_reply payload:------", messagingEvent.message.quick_reply);
                            quickpayload(messagingEvent)
                        }
                        //receivedMessage
                    }
                    //var msgText = messagingEvent.message.text;
                    // console.log("messaging :------", messagingEvent);
                    // console.log("messaging quick_reply payload:------", messagingEvent.message.quick_reply);
                    //  receivedmessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    //receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    receivedpostback(messagingEvent);
                } else if (messagingEvent.read) {
                    //console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
});

// postback payload section Start ********************************************
function receivedpostback(messagingEvent) {
    var categoryName = messagingEvent.postback.payload;
    var userid = messagingEvent.sender.id;
    // var catname = categoryName.toLowerCase();
    // console.log("catname", catname);
    console.log("???????????????????????categoryName?????????????????????", categoryName);
    var movietitle = categoryName.search("%mname%");
    var tvshowstitle = categoryName.search("%tvshows%");
    var albumname = categoryName.search("%albumname%");
    var sportsquicktitle = categoryName.search("%sportsQRtitle%");
    if (movietitle != -1) {
        //console.log("Yessssssss");
        var moviename = categoryName.replace(" %mname%", "");
        console.log("Yes this is %movies%");
        actorintro(messagingEvent, moviename);
        //celebritymovies(messagingEvent, moviename);
    } else if (tvshowstitle != -1) {
        console.log("Yes this is %tvshows%");
        var tvshowname = categoryName.replace(" %tvshows%", "");
        //console.log("Yessssssss", moviename);
        tvshows.tvshowinfo(messagingEvent, tvshowname);
        //celebritymovies(messagingEvent, moviename);
    } else if (albumname != -1) {
        console.log("Yes this is %albumname%");
        var albumname = categoryName.replace(" %albumname%", "");
        //console.log("Yessssssss", moviename);
        music.albuminfo(messagingEvent, albumname);
        //celebritymovies(messagingEvent, moviename);
    } else if (sportsquicktitle != -1) {
        console.log("Yes this is %sportsquicktitle%");
        var qrtitle = categoryName.replace(" %sportsQRtitle%", "");
        //console.log("Yessssssss", moviename);
        //music.albuminfo(messagingEvent, albumname);
        sports.sportsqrintro(messagingEvent, qrtitle);
        //celebritymovies(messagingEvent, moviename);

    } else {
        var packId = parseInt(categoryName);
        if (isNaN(packId)) {
            //sendContentPacks(messageText, event);
            var res = categoryName.toLowerCase();
            console.log("********************************************************", res);
            //payloadText.sendContentPacks(categoryName, messagingEvent);
            payloadText.sendContentPacks(res, messagingEvent);
        } else {
            //sendContentPackItems(packId, messagingEvent);
            celebrityid(packId, messagingEvent);
            console.log("postback_sender_id:------", packId);
        }
        console.log("postback_sender_id:------", userid);
    }

}
// postback payload section end *****************************
// Quick_Reply payload section start
function quickpayload(messagingEvent) {
    var event = messagingEvent
    console.log("entered in the quickpayload function");
    var quicktext = messagingEvent.message.quick_reply;
    var quickpayloadtext = quicktext.payload;
    var res = quickpayloadtext.toLowerCase();
    var userid = messagingEvent.sender.id;
    var movietext = quickpayloadtext.search("%m%");
    var actortext = quickpayloadtext.search("%a%");
    var actressname = quickpayloadtext.search("%aa%");
    var directorname = quickpayloadtext.search("%ad%");
    var action = quickpayloadtext.search("%action%");
    var comedy = quickpayloadtext.search("%comedy%");
    var romance = quickpayloadtext.search("%romance%");
    var thriller = quickpayloadtext.search("%thriller%");
    var sociofantasy = quickpayloadtext.search("%socio-fantasy%");
    var drama = quickpayloadtext.search("%drama%");
    var celpics = quickpayloadtext.search("%pictures%");
    var celmovies = quickpayloadtext.search("%movies%");
    var celmoviesid = quickpayloadtext.search("%moviesid%");
    var celnetworth = quickpayloadtext.search("%networth%");
    var celcomp = quickpayloadtext.search("%Moviecomp%");
    var celnews = quickpayloadtext.search("%news%");
    var celfamily = quickpayloadtext.search("%family%");
    var celabout = quickpayloadtext.search("%about%");
    var sub_quick_reply = quickpayloadtext.search("%QRsub%");
    var main_quick_reply = quickpayloadtext.search("%QR%");
    //tv shows celebrity details
    var tvcelebrity = quickpayloadtext.search("%tvcel%");
    var tvcelpics = quickpayloadtext.search("%tvcelpics%");
    var tvcelawards = quickpayloadtext.search("%tvcelawards%");
    var tvcelnetworth = quickpayloadtext.search("%tvcelnetworth%");
    var tvcelnews = quickpayloadtext.search("%tvcelnews%");
    var tvcomedy = quickpayloadtext.search("%tvComedy%");
    var tvcrime = quickpayloadtext.search("%tvCrime%");
    var tvreality = quickpayloadtext.search("%tvReality%");
    //sports celebrity details
    var sportsquicktitle = quickpayloadtext.search("%sportsQRtitle%");
    var sportscelebrityname = quickpayloadtext.search("%sportscel%");
    var sportscelpics = quickpayloadtext.search("%sportscelpics%");
    var sportscelnews = quickpayloadtext.search("%sportscelnews%");
    var sportscelawards = quickpayloadtext.search("%sportscelawards%");
    var sportscelnetworth = quickpayloadtext.search("%sportscelnetworth%");
    var sportscelcompe = quickpayloadtext.search("%sportscelcompetitors%");
    //music celebrity details
    var musicartistname = quickpayloadtext.search("%musicartist%");
    var musicartistpics = quickpayloadtext.search("%musiccelpics%");
    var musicartistawards = quickpayloadtext.search("%musiccelawards%");
    var musicartistnet = quickpayloadtext.search("%musiccelnetworth%");
    var musicartistnews = quickpayloadtext.search("%Musiccelnews%");
    var musicartistalbum = quickpayloadtext.search("%Musiccelalbums%");
    var musicartistsongs = quickpayloadtext.search("%Musiccelsongs%");
    var musicartistcomp = quickpayloadtext.search("%Musiccelcomp%");

    if (celpics != -1 || celmovies != -1 || celnetworth != -1 || celnews != -1 || celfamily != -1 || celabout != -1 || celcomp != -1) {
        console.log("This is celebritypics condition");
        celebritypics(messagingEvent, quickpayloadtext);
    } else if (celmoviesid != -1) {
        var actorname = quickpayloadtext.replace(" %movies%", "");
        var packId = parseInt(actorname);
        console.log("this is celebrity Id:",packId);
        celebrityid(packId, messagingEvent);
      //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (action != -1 || comedy != -1 || romance != -1 || thriller != -1 || drama != -1 || sociofantasy != -1) {
        console.log("This is getgenremovies condition");
        movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (actortext != -1) {
        var actorname = quickpayloadtext.replace(" %a%", "");
        console.log("actor name", actorname);
        var type = "leadActor";
        filmactor(messagingEvent, actorname);
    }else if (actressname != -1) {
        var actressname = quickpayloadtext.replace(" %aa%", "");
        var type = "leadActress";
        console.log("actor name", actorname);
        movies.actressfilms(messagingEvent, actressname, type);
    }else if (directorname != -1) {
        var directorname = quickpayloadtext.replace(" %ad%", "");
        var type = "director";
        console.log("actor name", actorname);
        movies.directorfilms(messagingEvent, directorname, type);
    } else if (movietext != -1) {
        var moviename = quickpayloadtext.replace(" %m%", "");
        console.log("Yessssssss", moviename);
        movies.getmovies(event, moviename);
    } else if (tvcelebrity != -1) {
        var celbrityname = quickpayloadtext.replace(" %tvcel%", "");
        console.log("Yessssssss", celbrityname);
        tvshows.tvcelbrityintro(event, celbrityname);
    } else if (tvcelpics != -1 || tvcelawards != -1 || tvcelnetworth != -1 || tvcelnews != -1) {
        console.log("This is getgenremovies condition");
        tvshows.tvcelebrityinfo(messagingEvent, quickpayloadtext);
    } else if (tvcomedy != -1 || tvcrime != -1 || tvreality != -1) {
        console.log("This is getgenremovies condition");
        tvshows.gettvshowsgenre(messagingEvent, quickpayloadtext);
    } else if (sportsquicktitle != -1) {
        console.log("Sport Quick_reply Title");
        var qrtitle = quickpayloadtext.replace(" %sportsQRtitle%", "");
        sports.sportsqrintro(messagingEvent, qrtitle);
    } else if (sub_quick_reply != -1) {
        console.log("Sport Quick_reply Title");
        //var qrtitle = quickpayloadtext.replace(" %QR%", "");
        quick_reply_subcategory(messagingEvent, quickpayloadtext);
    } else if (main_quick_reply != -1) {
        console.log("Sport Quick_reply Title");
        //var qrtitle = quickpayloadtext.replace(" %QR%", "");
        quick_reply_category(messagingEvent, quickpayloadtext);
    } else if (sportscelebrityname != -1) {
        console.log("Sport celebrity Name");
        var sportscelname = quickpayloadtext.replace(" %sportscel%", "");
        sports.sportscelbrityintro(messagingEvent, sportscelname);
    } else if (sportscelpics != -1 || sportscelnews != -1 || sportscelawards != -1 || sportscelnetworth != -1 || sportscelcompe != -1) {
        console.log("This is getgenremovies condition");
        sports.sportscelebrityinfo(messagingEvent, quickpayloadtext);
    } else if (musicartistname != -1) {
        console.log("Music celebrity Name");
        var musiccelname = quickpayloadtext.replace(" %musicartist%", "");
        music.musiccelbrityintro(messagingEvent, musiccelname);
    } else if (musicartistpics != -1 || musicartistawards != -1 || musicartistnet != -1 || musicartistnews != -1 || musicartistalbum != -1 || musicartistsongs != -1 || musicartistcomp != -1) {
        console.log("This is getgenremovies condition");
        music.musiccelebrityinfo(messagingEvent, quickpayloadtext);
    } else {
        payloadText.sendContentPacks(res, messagingEvent);
    }

}
// Quick_Reply payload section start *********************************
// wit.ai function for verify the text in wit.ai
function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    var messageId = message.mid;
    var msgwit_value;
    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var msgwit = messageText;
    console.log("*************messageText*************", messageText);
    request({
        uri: 'https://api.wit.ai/message?v=20161020&q=' + msgwit,
        headers: {
            //"Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX"
            "Authorization": "Bearer LZ7DCQVUW3FWMSF4MAD35CSYUCMOW2W4"
        }
    }, function(error, response) {
        if (error) {
            console.log("Error While geting response from Wit:", error);
        } else {
            var res = JSON.stringify(response);
            var res_data = response.body;
            var wit_res_data = JSON.parse(res_data);
            var wit_res_data_ent = wit_res_data.entities;
            var wit_res_data_intent = wit_res_data_ent.intent;
            var wit_res_data_location = wit_res_data_ent.location;
            var wit_res_msg_id = wit_res_data.msg_id;

            console.log("Response from Wit--Res", res);
            //console.log("Response from wit_res_data", wit_res_data);
            console.log("Response from wit_res_data", res_data);
            //console.log("Response from Wit--response", response);
            console.log("Response from Wit--msg_id", wit_res_data.msg_id);
            console.log("Response from Wit************1", wit_res_data.entities);

            console.log("Response from Wit************2search_query", wit_res_data_ent.search_query);
            console.log("Response from Wit************2", wit_res_data_ent.intent);
            console.log("Response from Wit************3", wit_res_data_ent.location);
            console.log("Response from Wit************4", wit_res_data_intent);
            console.log("Response from Wit************5", wit_res_data_location);
            //console.log("Response from Wit************6", wit_res_data_intent.value);
            //var intentlength = wit_res_data_intent.length;
            //if (JSON.stringify(wit_res_data_ent) === '{}') { //This will check if the object is empty
            if (JSON.stringify(wit_res_data_ent.intent) === '{}' || wit_res_data_ent.intent == undefined) {
                //sendHelpMessage(event);
                textmessage(msgwit, event);
                //sendContentPacks(msgwit, event)
                console.log("wit_res_data_intent.length is Zero", wit_res_data_ent);
                console.log("wit_res_data_intent.length is Zero", event);
            } else {
                for (var i = 0; i < wit_res_data_intent.length; i++) {
                    var td1 = wit_res_data_intent[i]["confidence"];
                    var td2 = wit_res_data_intent[i]["type"];
                    var td3 = wit_res_data_intent[i]["value"];
                }
                console.log("confidence************5", td1);
                console.log("type************5", td2);
                console.log("value************5", td3);
                msgwit_value = td3.toLowerCase();
                console.log('******msgwit_value', msgwit_value);
                //bot.getwitmsg(wit_res_msg_id,msgwit_value,msgwit);
                receivedtextmessage(msgwit_value, event);
                //  bot.wittest(msgwit_value);
            }
        }
    });
}

function quick_reply_subcategory(messagingEvent, quickpayloadtext) {
    var genrearray = quickpayloadtext.split(',');
    var qrname = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", qrname);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_quickreply_preference where subCategory =(select id from cc_subcategories where subCategoryName=?) and title =?', [
            subCategory, qrname
        ], function(err, rows) {
            console.log("*************************quickpaly", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var rowslenth = rows.length;
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].title,
                        //"image_url": rows[i].picture1,
                        "subtitle": rows[i].description,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].imageUrl,
                                "title": "...Continue Reading ▶"
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
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Pics",
                                "payload": "pics"
                            },{
                                "content_type": "text",
                                "title": "Videos",
                                "payload": "videos"
                            },{
                                "content_type": "text",
                                //"title": subCategory.toUpperCase(),
                                "title": subCategory.charAt(0).toUpperCase() + subCategory.substr(1).toLowerCase(),
                                "payload": subCategory
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
function quick_reply_category(messagingEvent, quickpayloadtext) {
    var genrearray = quickpayloadtext.split(',');
    var qrname = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", qrname);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_quickreply_preference where category =(select id from cc_categories where categoryName = ?) and title = ?', [
            subCategory, qrname
        ], function(err, rows) {
            console.log("*************************quickpaly", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var rowslenth = rows.length;
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].title,
                        //"image_url": rows[i].picture1,
                        "subtitle": rows[i].description,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].imageUrl,
                                "title": "...Continue Reading ▶"
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
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                //"title": subCategory.toUpperCase(),
                                "title": subCategory.charAt(0).toUpperCase() + subCategory.substr(1).toLowerCase(),
                                "payload": subCategory
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

//selected celebrity images***************************

function celebritypics(messagingEvent, quickpayloadtext) {
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_film_celebrity_preference where name = ?', [actername], function(err, rows) {
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
                var celebrityid;
                var keyMap;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    celebrityname = rows[i].name;
                    celebrityid = rows[i].id;
                    if (subCategory == "%pictures%") {
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
                    } else if (subCategory == "%movies%") {
                      //var movieslist = rows[i].lastFiveMovies;
                      // var latestmovie = rows[i].latestMovie;
                        console.log("celebrity Movies");
                        celebritymovielist(messagingEvent, celebrityname);
                        //movies.selectedactorfilems(messagingEvent, celebrityname);
                    }else if (subCategory == "%Moviecomp%") {
                      var competitor = rows[i].competitors;
                      var picurl = rows[i].picture2;
                      var name = rows[i].name;
                      console.log("celebrity Family");
                      selectedactorcomptiters(messagingEvent, competitor, picurl, name);

                    } else if (subCategory == "%networth%") {
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
                    } else if (subCategory == "%news%") {
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
                                                "url": rows[i].newslink,
                                                "title": "Click for News 📢"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%family%") {
                        console.log("celebrity Family");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].family,
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
                    } else if (subCategory == "%about%") {
                        console.log("celebrity Family");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": "About",
                                        "image_url": rows[i].picture4,
                                        "subtitle": rows[i].name,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].personalInfo,
                                                "title": "More Info ℹ"
                                            }
                                        ]
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
                                "title": 'Pictures',
                                "payload": celebrityname + ' ,%pictures%'
                            }, {
                                "content_type": "text",
                                "title": 'Movies',
                                "payload": celebrityname + ' ,%movies%'
                            },{
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
                            },
                            // {
                            //     "content_type": "text",
                            //     "title": celebrityname+" Personal",
                            //     "payload": "Personal"
                            // },
                            {
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


function selectedactorcomptiters(messagingEvent, competitor, picurl, name){
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
                  "payload": name1 + " %a%"
              }, {
                  "content_type": "text",
                  "title": name2,
                  "payload": name2 + " %a%"
              }, {
                  "content_type": "text",
                  "title": "Back To Movies 🎬",
                  "payload": "Movies"
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


//Selected actor filems from movies list
function actorintro(messagingEvent, moviename) {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": "Here you go👉..."
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    celebritymovies(messagingEvent, moviename);
}

//Getting the celebrity related movies from selected celebrity
function celebritymovies(messagingEvent, moviename) {
    console.log("*************Celebritymovies name************", moviename);
    var Actor;
    var Actress;
    var director;
    var musicDirector;
    pool.getConnection(function(err, connection) {
        connection.query('select  * from cc_movies_preference where movieName= ?', [moviename], function(error, rows) {
            if (error) {
                console.log('error while retriving content pack items from database', error);
            } else if (rows.length > 0) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    console.log('Getting the celebrity related movies from selected celebrity:', rows);
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
                    actor = rows[i].leadActor;
                    actress = rows[i].leadActress;
                    director = rows[i].director;
                    musicDirector = rows[i].musicDirector;
                    console.log("actor", actor);
                    console.log("actor", actress);
                    console.log("actor", director);
                    console.log("actor", musicDirector);
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
                                "title": actor,
                                "payload": actor + " %a%"
                            }, {
                                "content_type": "text",
                                "title": actress,
                                "payload": actress + " %a%"
                            }, {
                                "content_type": "text",
                                "title": director,
                                "payload": director + " %a%"
                            }, {
                                "content_type": "text",
                                "title": musicDirector,
                                "payload": musicDirector + " %musicartist%"
                            }, {
                                "content_type": "text",
                                "title": "Back to Movies 🎬",
                                "payload": "Movies"
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
            connection.release();
        });
    });
}
//Getting the celebrity related movies from selected celebrity**************

//celebritiesdetails***************************************************
function celebrityid(categoryName, event) {
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        connection.query('select * from cc_celebrity_preference where id = ?', [categoryName], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                var usercelebrityName;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    usercelebrityName = rows[i].celebrityName;
                    var movi = "Mov**"
                    var readmorebtn = (usercelebrityName + ",").concat(movi);
                    var keyMap = {
                        "title": rows[i].celebrityName,
                        "image_url": rows[i].celebrityImageUrl,
                        //"subtitle":rows[i].description,
                        //  "item_url": rows[i].image_url,
                        // "buttons":[{
                        //     "type": "postback",
                        //     "title": "Read More",
                        //     "payload": readmorebtn
                        // }]
                    };
                    contentList.push(keyMap);
                    movieslist = rows[i].lastFiveMovies;
                    console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%", movieslist);
                }
                updateusercelebrity(usercelebrityName, senderID);
                var myarray = movieslist.split(',');
                for (var i = 0; i < myarray.length; i++) {
                    console.log(myarray[i]);
                    //  var res1 = myarray[i].concat(myarray[i]);
                    //  console.log(res1);
                    var moviearray = {
                        "content_type": "text",
                        "title": myarray[i],
                        "payload": myarray[i] + " %m%"
                    }
                    quickList.push(moviearray);
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
//celebritiesmoviedetails ends*************************************
function celebritymovielist(messagingEvent, celebrityname){
  var event = messagingEvent;
  var movie1;
  var movie2;
  var movie3;
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        connection.query('select * from cc_film_celebrity_preference where name = ?', [celebrityname], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                var senderID = event.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                var latestmovie;
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                var usercelebrityName;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    usercelebrityName = rows[i].name;
                    latestmovie = rows[i].latestMovie;
                    var movi = "Mov**"
                    var readmorebtn = (usercelebrityName + ",").concat(movi);
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        //"subtitle":rows[i].description,
                        //  "item_url": rows[i].image_url,
                        // "buttons":[{
                        //     "type": "postback",
                        //     "title": "Read More",
                        //     "payload": readmorebtn
                        // }]
                    };
                    contentList.push(keyMap);
                    movieslist = rows[i].lastFiveMovies;
                    console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%", movieslist);
                }
                updateusercelebrity(usercelebrityName, senderID);
                var myarray = movieslist.split(',');
                for (var i = 0; i < myarray.length; i++) {
                  movie1 = myarray[1];
                  movie2 = myarray[2];
                  movie3 = myarray[3];

                    console.log(myarray[1]);
                    console.log(myarray[2]);
                    console.log(myarray[3]);

                    //  var res1 = myarray[i].concat(myarray[i]);
                    //  console.log(res1);
                    var moviearray = {
                        "content_type": "text",
                        "title": myarray[i],
                        "payload": myarray[i] + " %m%"
                    }
                    quickList.push(moviearray);
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
                                "title": latestmovie,
                                "payload": latestmovie + " %m%"
                            },  {
                                "content_type": "text",
                                "title": movie1,
                                "payload": movie1 + " %m%"
                            }, {
                                "content_type": "text",
                                "title": movie2,
                                "payload": movie2 + " %m%"
                            }, {
                                "content_type": "text",
                                "title": movie3,
                                "payload": movie3 + " %m%"
                            },  {
                                "content_type": "text",
                                "title": "Back To Movies 🎬",
                                "payload": "Movies"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');

            } else if (rows.length >= 0) {
              googleSearch.googlegraph(celebrityname, event);
            }else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

//updateing the celebritiesdetails in user_preforence
function updateusercelebrity(usercelebrityName, senderID) {
    console.log("******************categoryName*************", usercelebrityName);
    console.log("******************senderID*************", senderID);
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set favCelebrity= ? where facebookId=?', [
            usercelebrityName, senderID
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
//updateing the celebritiesdetails in user_preforence******************************

function textmessage(msgwit, messagingEvent) {
    var msgText = messagingEvent.message.text;
    console.log("messaging_message:------", messagingEvent.message);
    console.log("messaging_message_text:------", messagingEvent.message.text);
    console.log("messaging_msgText:------", msgText);
    console.log("messaging_msgText:------:------", msgwit);
    //payloadText.sendContentPacks(msgText, messagingEvent);
    receivedtextmessage(msgText, messagingEvent);
};

// Quick_reply payload section Start
function receivedtextmessage(categoryName, event) {
    //var categoryName = messagingEvent.message.text;
    var userid = event.sender.id;
    var categoryName = categoryName.toLowerCase();
    //var quickButton =
    console.log("quickButton_postback:------", categoryName);
    console.log("postback_sender_id:------", userid);
    payloadText.sendContentPacks(categoryName, event);
}
// Quick_reply payload section End *****************************

// get filmactor from the DB *******************************
function filmactor(messagingEvent, actorname) {
    console.log("filmactor", actorname);
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
                            },  {
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
            }else if (rows.length == 0) {
              googleSearch.googlegraph(celbrityname, event);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });
}
//End get filmactor name from the DB***************

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
app.listen(process.env.PORT);

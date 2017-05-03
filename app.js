var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cricapi = require("node-cricapi");
var panorama = require('google-panorama-by-location');
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

//var quickMenu = payloadText.quickMenu;

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
    var actortext = categoryName.search("%a%");
    if (movietitle != -1) {
        //console.log("Yessssssss");
        var moviename = categoryName.replace(" %mname%", "");
        console.log("Yes this is %movies%");
        movieintro(messagingEvent, moviename);
        //celebritymovies(messagingEvent, moviename);
    } else if (tvshowstitle != -1) {
        console.log("Yes this is %tvshows%");
        var tvshowname = categoryName.replace(" %tvshows%", "");
        //console.log("Yessssssss", moviename);
        tvshows.tvshowinfo(messagingEvent, tvshowname);
        //celebritymovies(messagingEvent, moviename);
    } else if (actortext != -1) {
        var actorname = quickpayloadtext.replace(" %a%", "");
        console.log("actor name", actorname);
        var type = "leadActor";
        movies.filmactor(messagingEvent, actorname);
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
    var conversationQueuetitle = quickpayloadtext.search("%movie_conv%");
    var moviecelbrity_conv1 = quickpayloadtext.search("%celebrity_conv1%");
    var moviecelbrity_conv2 = quickpayloadtext.search("%celebrity_conv2%");
    var moviecelbrity_conv3 = quickpayloadtext.search("%celebrity_conv3%");
    var moviecelbrity_Fantastic = quickpayloadtext.search("%Fantastic!%");
    var moviecelbrity_isit = quickpayloadtext.search("%Is it?%");

    if (celpics != -1 || celmovies != -1 || celnetworth != -1 || celnews != -1 || celfamily != -1 || celabout != -1 || celcomp != -1) {
        console.log("This is celebritypics condition");
        celebritypics(messagingEvent, quickpayloadtext);
    } else if (celmoviesid != -1) {
        var actorname = quickpayloadtext.replace(" %movies%", "");
        var packId = parseInt(actorname);
        console.log("this is celebrity Id:", packId);
        celebrityid(packId, messagingEvent);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (moviecelbrity_conv1 != -1) {
        var celebrityQueuetitle = quickpayloadtext.replace("%celebrity_conv1%", "");
        console.log("conversationQueuetitle:--------------", celebrityQueuetitle);
        movies.celebrity_Queue_block1_details(messagingEvent, quickpayloadtext);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (moviecelbrity_conv2 != -1) {
        var celebrityQueuetitle = quickpayloadtext.replace("%celebrity_conv2%", "");
        console.log("conversationQueuetitle:--------------", celebrityQueuetitle);
        movies.celebrity_Queue_block2_details(messagingEvent, quickpayloadtext);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (moviecelbrity_conv3 != -1) {
        var celebrityQueuetitle = quickpayloadtext.replace("%celebrity_conv3%", "");
        console.log("conversationQueuetitle:--------------", celebrityQueuetitle);
        movies.celebrity_Queue_block3_details(messagingEvent, quickpayloadtext);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (conversationQueuetitle != -1) {
        var Queuetitle = quickpayloadtext.replace("%movie_conv%", "");
        console.log("conversationQueuetitle:--------------", Queuetitle);
        movies_Queue_title_details(messagingEvent, quickpayloadtext);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (conversationQueuetitle != -1) {
        var Queuetitle = quickpayloadtext.replace("%conv%", "");
        console.log("conversationQueuetitle:--------------", Queuetitle);
        category_Queue_title_details(messagingEvent, Queuetitle);
        //  movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (moviecelbrity_Fantastic != -1 || moviecelbrity_isit != -1) {
        console.log("This is getgenremovies condition");
        var type = "Fantastic";
        movies.celbrity_Fantastic_wow(messagingEvent, quickpayloadtext, type);
    } else if (action != -1 || comedy != -1 || romance != -1 || thriller != -1 || drama != -1 || sociofantasy != -1) {
        console.log("This is getgenremovies condition");
        movies.getgenremovies(messagingEvent, quickpayloadtext);
    } else if (actortext != -1) {
        var actorname = quickpayloadtext.replace(" %a%", "");
        console.log("actor name", actorname);
        var type = "leadActor";
        movies.filmactor(messagingEvent, actorname);
    } else if (actressname != -1) {
        var actressname = quickpayloadtext.replace(" %aa%", "");
        var type = "leadActress";
        console.log("actor name", actorname);
        movies.actressfilms(messagingEvent, actressname, type);
    } else if (directorname != -1) {
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
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var msgwit = messageText;
    console.log("*************messageText*************", messageText);
    request({
        uri: 'https://api.wit.ai/message?v=20161020&q=' + msgwit,
        headers: {
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
            var wit_res_data_actor = wit_res_data_ent.actor;
            var wit_res_data_movie = wit_res_data_ent.movie;
            var wit_res_data_sportsman = wit_res_data_ent.sportsman;
            var wit_res_data_music_artist = wit_res_data_ent.music_artist;
            //music_artist
            var wit_res_msg_id = wit_res_data.msg_id;
            console.log("Response from Wit--Res", res);
            console.log("Response from wit_res_data", res_data);
            console.log("Response from Wit--msg_id", wit_res_data.msg_id);
            console.log("Response from Wit************entities:", wit_res_data.entities);
            console.log("Response from Wit************actor:", wit_res_data_actor);
            console.log("Response from Wit************movie:", wit_res_data_movie);
            console.log("Response from Wit************sports:", wit_res_data_sportsman);
            console.log("Response from Wit************music_artist:", wit_res_data_music_artist);
            console.log("Response from Wit************search_query:", wit_res_data_ent.search_query);
            //console.log("Response from Wit************2", wit_res_data_ent.intent);
            //console.log("Response from Wit************3", wit_res_data_ent.location);
            console.log("Response from Wit************intent:", wit_res_data_intent);
            console.log("Response from Wit************location:", wit_res_data_location);
            //console.log("Response from Wit************6", wit_res_data_intent.value);
            //var intentlength = wit_res_data_intent.length;
            //if (JSON.stringify(wit_res_data_ent) === '{}') { //This will check if the object is empty
            if (wit_res_data_ent.intent == undefined && wit_res_data_ent.actor == undefined && wit_res_data_ent.movie == undefined && wit_res_data_sportsman == undefined && wit_res_data_ent.music_artist == undefined) {
                textmessage(msgwit, event);
                console.log("wit_res_data_intent.length is Zero", wit_res_data_ent);
                console.log("wit_res_data_intent.length is Zero", event);
            } else if (wit_res_data_actor != undefined) {
                for (var i = 0; i < wit_res_data_actor.length; i++) {
                    var td1 = wit_res_data_actor[i]["confidence"];
                    var td2 = wit_res_data_actor[i]["type"];
                    var actorname = wit_res_data_actor[i]["value"];
                }
                console.log("wit_res_data_actor:--------------", actorname);
                var messagingEvent = event;
                actorintro(messagingEvent, actorname);
            } else if (wit_res_data_movie != undefined) {
                for (var i = 0; i < wit_res_data_movie.length; i++) {
                    var td1 = wit_res_data_movie[i]["confidence"];
                    var td2 = wit_res_data_movie[i]["type"];
                    var moviename = wit_res_data_movie[i]["value"];
                }
                console.log("wit_res_data_movie:--------------", moviename);
                movies.getmovies(event, moviename);
            } else if (wit_res_data_sportsman != undefined) {
                for (var i = 0; i < wit_res_data_sportsman.length; i++) {
                    var td1 = wit_res_data_sportsman[i]["confidence"];
                    var td2 = wit_res_data_sportsman[i]["type"];
                    var sportsman = wit_res_data_sportsman[i]["value"];
                }
                console.log("wit_res_data_sportsman:--------------", sportsman);
                sports.sportscelbrityintro(event, sportsman);
            } else if (wit_res_data_music_artist != undefined) {
                for (var i = 0; i < wit_res_data_music_artist.length; i++) {
                    var td1 = wit_res_data_music_artist[i]["confidence"];
                    //var td2 = wit_res_data_music_artist[i]["type"];
                    var music_artist = wit_res_data_music_artist[i]["value"];
                }
                console.log("wit_res_data_sportsman:--------------", music_artist);
                //music.music_artist(event, sportsman);
                music.musiccelbrityintro(event, music_artist);
            } else {
                for (var i = 0; i < wit_res_data_intent.length; i++) {
                    var td1 = wit_res_data_intent[i]["confidence"];
                    var td2 = wit_res_data_intent[i]["type"];
                    var td3 = wit_res_data_intent[i]["value"];
                }
                console.log("intent_confidence:", td1);
                console.log("intent_type:", td2);
                console.log("intent_value:", td3);
                msgwit_value = td3.toLowerCase();
                console.log('******msgwit_value', msgwit_value);
                receivedtextmessage(msgwit_value, event);
            }
        }
    });
}

function movies_Queue_title_details(messagingEvent, quickpayloadtext) {
    var genrearray = quickpayloadtext.split(',');
    var Queuetitle = genrearray[0];
    var celebrity = genrearray[1];
    var storyUrl = genrearray[2];
    var desc = genrearray[3];
    var senderID = messagingEvent.sender.id;
    var contentList = [];
    console.log('Queuetitle:---------', Queuetitle);
    console.log('celebrity:---------', celebrity);
    console.log('storyUrl:---------', storyUrl);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_conversation_two where conversationQueue = ? and celebrityName = ?', [
            Queuetitle, celebrity
        ], function(err, rows) {
            console.log("*************************quickpaly", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length > 0) {
                console.log("*******cc_celebrity_preference data from database:*********", rows);
                for (var i = 0; i < 1; i++) {
                    celebrityName = rows[i].celebrityName;
                    description = rows[i].description;
                    conversationQueue = rows[i].conversationQueue;
                    quickReply1 = rows[i].quickReply1;
                    quickReply2 = rows[i].quickReply2;
                    quickReply3 = rows[i].quickReply3;
                    // var keyMap = {
                    //     "title": celebrityName,
                    //     //"image_url": rows[i].picture1,
                    //     "subtitle": rows[i].description,
                    //     "buttons": [
                    //         {
                    //             "type": "web_url",
                    //             "url": rows[i].storyUrl,
                    //             "title": "...Continue Reading ▶"
                    //         }
                    //     ]
                    // };
                    // contentList.push(keyMap);
                }

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
                Queuetitle_data(messagingEvent, celebrity, Queuetitle, storyUrl, desc);
            }
            connection.release();
        });
    });
}

function Queuetitle_data(messagingEvent, celebrity, Queuetitle, storyUrl, desc) {
    if (Queuetitle == "Yes! I too..." || Queuetitle == "Wow!" || Queuetitle == "Tell me more") {
        var senderID = messagingEvent.sender.id;
        console.log('---------:senderID:---------', senderID);
        console.log('---------:celebrity:---------', celebrity);
        console.log('---------:Queuetitle:---------', Queuetitle);
        console.log('---------:storyUrl:---------', storyUrl);
        console.log('---------:desc:---------', desc);

        var description = 'Thanks, Hey you want to know about ' + celebrity + 'please select the below button';
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
                                "title": celebrity,
                                "subtitle": desc,
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": storyUrl,
                                        "title": "Continue Reading ⏩"
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
                        "title": celebrity,
                        "payload": celebrity + " %a%"
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
    } else if (Queuetitle == "No stories please") {
        update_conversation_usercelebrity(messagingEvent)
        // var categoryName = "movies";
        // payloadText.sendContentPacks(categoryName, messagingEvent);
    } else {
        console.log("No Data Found From Database");
        sendHelpMessage(messagingEvent);
    }
}

function update_conversation_usercelebrity(messagingEvent) {
    var senderID = messagingEvent.sender.id;
    //console.log("******************categoryName*************", usercelebrityName);
    //console.log("******************senderID*************", senderID);
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set movieCelebrity = null where facebookId = ?', [senderID], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("update the movieCelebrity name into null ");
                //sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
    var categoryName = "movies";
    payloadText.sendContentPacks(categoryName, messagingEvent);
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
                                "title": "Proceed 👉"
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
                            }, {
                                "content_type": "text",
                                "title": "Videos",
                                "payload": "videos"
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
                                "title": "Continue Reading ⏩"
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
                                "title": subCategory.charAt(0).toUpperCase() + subCategory.substr(1).toLowerCase() + " Jokes",
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
            //console.log("********celebrity name*********", actername);
            //console.log("*************************-after", categoryName);
            console.log("*************************celebrity details", rows);
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
                    } else if (subCategory == "%Moviecomp%") {
                        console.log("celebrity networth");
                        var msg = '' + rows[i].name + '’s net worth is believed to be around ' + rows[i].netWorth + '.';
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                  {
                                      "title": rows[i].name,
                                      "image_url": rows[i].picture3,
                                      "subtitle": 'Lets see what Google knows about' + rows[i].name + '.',
                                      "buttons": [
                                      {
                                          "type":"web_url",
                                          "url": rows[i].googleSearch,
                                          "title":"Proceed 👉"
                                      }
                                      ]
                                  }
                                ]
                            }
                        }
                    } else if (subCategory == "%networth%") {
                        console.log("celebrity networth");
                        var msg = '' + rows[i].name + '’s net worth is believed to be around ' + rows[i].netWorth + '.';
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture3,
                                        "subtitle": 'Lets get into more personals',
                                        "buttons": [
                                        {
                                            "type":"web_url",
                                            "url": rows[i].personalInfo,
                                            "title":"Proceed 👉"
                                        }
                                        ]
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
                        console.log("about celebrity");
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
                            },
                            {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": celebrityname + ' ,%Moviecomp%'
                            },
                            {
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

function selectedactorcomptiters(messagingEvent, competitor, picurl, name) {
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

function actorintro(messagingEvent, actorname) {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    var msg = 'Here is what I know about ' + actorname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    movies.filmactor(messagingEvent, actorname);
}

//Selected actor filems from movies list
function movieintro(messagingEvent, moviename) {
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
function celebritymovielist(messagingEvent, celebrityname) {
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
                            }, {
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

            } else if (rows.length >= 0) {
                googleSearch.googlegraph(celebrityname, event);
            } else {
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
    //console.log("******************categoryName*************", usercelebrityName);
    //console.log("******************senderID*************", senderID);
    pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set movieCelebrity= ? where facebookId=?', [
            usercelebrityName, senderID
        ], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else {
                console.log("Updated the movie celebrity name in the DB");
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
    var rows = messagingEvent.message.attachments;
    if (rows != undefined) {
        for (var i = 0; i < rows.length; i++) {
            console.log("messaging_message Location:------", messagingEvent.message.attachments[i].payload);
            var location_payload = messagingEvent.message.attachments[i].payload;
            //  var location_payload_coordinates = location_payload.coordinates;
            //var location_payload_coordinates_lat = location_payload.coordinates.lat;
            //var location_payload_coordinates_long = location_payload.coordinates.long;
            //  var location = [location_payload_coordinates_lat, location_payload_coordinates_long];
            // panorama(location, function(err, result) {
            //     if (err) {
            //         console.log(err);
            //     } else {
            //         // pano ID
            //         console.log(result.id);
            //
            //         // actual latitude, longitude
            //         console.log(result.latitude);
            //
            //         console.log(result.longitude);
            //
            //         // other details from Google API
            //         console.log(result.copyright);
            //     }
            //
            // })

            //  console.log("messaging_message location_payload:------", location_payload);
            //  console.log("messaging_message location_payload_coordinates:------", location_payload_coordinates);
            //console.log("messaging_message location_payload_coordinates_lat:------", location_payload_coordinates_lat);
            //console.log("messaging_message location_payload_coordinates_long:------", location_payload_coordinates_long);
        }
    } else {
        console.log("messaging_message_text:------", messagingEvent.message.text);
        console.log("messaging_msgText:------", msgText);
        console.log("messaging_msgText:------:------", msgwit);
        //payloadText.sendContentPacks(msgText, messagingEvent);
        receivedtextmessage(msgText, messagingEvent);
    }
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
                            },
                            {
                                "content_type": "text",
                                "title": "Search in google",
                                "payload": celebrityname + ' ,%networth%'
                            }, {
                                "content_type": "text",
                                "title": "Personal Info",
                                "payload": celebrityname + ' ,%Moviecomp%'
                            },
                            {
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
                            }, {
                                "content_type": "text",
                                "title": "Bollywood",
                                "payload": "Bollywood"
                            }, {
                                "content_type": "text",
                                "title": "Kollywood",
                                "payload": "kollywood"
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

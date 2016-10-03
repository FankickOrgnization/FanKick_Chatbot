var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fetch = require('node-fetch');
const crypto = require('crypto');
const thread = require('./thread.js');
const payloadText = require('./payload.js');

app.use(bodyParser.json());
var fbpage_access_token = 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';

app.get('/webhook', function(req, res) {
    //console.log("Validating webhook", console.log(JSON.stringify(req.body)));
    console.log("######################################", res);
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'login_type') {
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
                    }
                    //var msgText = messagingEvent.message.text;
                    console.log("messaging :------", messagingEvent);
                  //  console.log("messaging :------", messagingEvent.message.quick_reply.payload);
                    receivedmessage(messagingEvent);
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

    console.log("postback_sender_id:------", userid);

    if (categoryName == "Get Started") {
        //greetingtext(messagingEvent,Get Started);
        thread.persistentMenu(fbpage_access_token);
        fbuserdetails(messagingEvent, userid);
        //sendTextMessage(userid, 'Get Started');
        console.log("categoryName", categoryName);
        //getStarted();
    }
}

// function getStarted() {
//
//     var messageData = {
//         "setting_type": "call_to_actions",
//         "thread_state": "new_thread",
//         "call_to_actions": [{
//             "payload": "Get Started"
//         }]
//     };
//     /*var messageData = {
//         "setting_type": "greeting",
//         "greeting": {
//             "text": "Timeless apparel for the masses."
//         }
//     };*/
//     var url = 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + fbpage_access_token + '';
//     callSendAPI(messageData, url);
// }
// Quick_reply payload section Start ********************************************
function receivedmessage(messagingEvent) {
    var categoryName = messagingEvent.message.text;
    var userid = messagingEvent.sender.id;
    //var quickButton =
      console.log("quickButton_postback:------", categoryName);
      console.log("postback_sender_id:------", userid);
      sendContentPacks(categoryName, messagingEvent);
      //payloadText.output(categoryName,messagingEvent);

    // if (categoryName == "Get Started") {
    //     //greetingtext(messagingEvent,Get Started);
    //     thread.persistentMenu(fbpage_access_token);
    //     fbuserdetails(messagingEvent, userid);
    //     //sendTextMessage(userid, 'Get Started');
    //     console.log("categoryName", categoryName);
    //     //getStarted();
    // }
}
// Quick_reply payload section End ********************************************

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": contentList
                        }
                    }
                }

    };
    callSendAPI(messageData, 'https://graph.facebook.com/v2.6/me/messages');
}

function fbuserdetails(event, userid) {
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        var username = userprofiledata.first_name;
        //console.log("--------:Response data:-------- ", JSON.stringify(body));
        console.log("--------:Response data:--------first_name ", userprofiledata.first_name);
        console.log("--------:Response data:--------last_name ", userprofiledata.last_name);
        console.log("--------:Response data:--------locale ", userprofiledata.locale);
        console.log("--------:Response data:-------- timezone", userprofiledata.timezone);
        console.log("--------:Response data:--------gender ", userprofiledata.gender);
        var senderID = event.sender.id;
        var msg = 'Hi '+username+', A lot of exciting things are awaiting for you! Get kicking!';
        console.log("--------:Response data:--------gender ", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                //"text":msg,
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": msg,
                            "buttons": [{
                                "type": "postback",
                                "title": "What can you do?",
                                "payload": "USER_DEFINED_PAYLOAD"
                            }]
                        }]
                    }
                },
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Categories",
                    "payload":"Categories"
                  },
                  {
                    "content_type":"text",
                    "title":"Fan Clubs",
                    "payload":"Fan Clubs"
                  },
                  {
                    "content_type":"text",
                    "title":"Fan Magazine",
                    "payload":"Fan Magazine"
                  },
                  {
                    "content_type":"text",
                    "title":"Movies",
                    "payload":"Movies"
                  },
                  {
                    "content_type":"text",
                    "title":"Sports",
                    "payload":"Sports"
                  },
                  {
                    "content_type":"text",
                    "title":"Celebrities",
                    "payload":"Celebrities"
                  },
                  {
                    "content_type":"text",
                    "title":"What can you do?",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                  }
                ]
              }
            }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
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

function sendContentPacks(categoryName, event) {
  console.log("*************---categoryName----*******", categoryName );
    if (categoryName == "Categories") {
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": "We have Fankick content on the following, why not try them out?",
                        "buttons": [{
                            "type": "postback",
                            "title": "Movies",
                            "payload": "Movies"
                        }, {
                            "type": "postback",
                            "title": "Sports",
                            "payload": "Sports"
                        }, {
                            "type": "postback",
                            "title": "Celebrities",
                            "payload": "Celebrities"
                        }]
                    }
                }
            }
        }
        callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    } else if (categoryName == "Fan Clubs") {
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM fk_pack_fanclub', function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];

                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].imageurl,
                        "item_url": rows[i].imageurl,
                        "buttons": [{
                            "type": "web_url",
                            "url": rows[i].wiki_url,
                            "title": "Read More"
                        }]
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
                        }
                    }
                }
                callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
            connection.release();
        });
        });
    } else if (categoryName == "Fan Magazine") {
        //console.log("***************************", categoryName);
        pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM fk_pack_fan_magazines', function(err, rows) {
            //console.log("*************************-after", categoryName);
            //console.log("*************************-after", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].imageurl,
                        "item_url": rows[i].imageurl,
                        "buttons": [{

                            "type": "postback",
                            "title": "Read More",
                            "payload": "USER_DEFINED_PAYLOAD"
                        }]
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
                        }
                    }
                }
                callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
            connection.release();
        });
        });
    } else if (categoryName == "Yes") {
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            //  "title": "Please Login into FanKick",
                            //  "image_url": "https://scontent.fbom1-2.fna.fbcdn.net/v/t1.0-1/p32x32/13627105_592208684292844_1737491960574535764_n.png?oh=ce8c86c4f7ba7348e003ef264f47a310&oe=587D2B8C",
                            "buttons": [{
                                "type": "postback",
                                "title": "Magazine",
                                "payload": "USER_DEFINED_PAYLOAD"
                            }]
                        }]
                    }
                }
            }
        }
        callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    } else if (categoryName == "No") {
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            // "message": {
            //     "attachment": {
            //         "type": "template",
            //         "payload": {
            //             "template_type": "generic",
            //             "elements": [{
            //                 //  "title": "Welcome to FanKick",
            //                 //  "image_url": "https://scontent.fbom1-2.fna.fbcdn.net/v/t1.0-1/p32x32/13627105_592208684292844_1737491960574535764_n.png?oh=ce8c86c4f7ba7348e003ef264f47a310&oe=587D2B8C",
            //                 "buttons": [{
            //                     "type": "postback",
            //                     "title": "Magazine",
            //                     "payload": "USER_DEFINED_PAYLOAD"
            //                 }]
            //             }]
            //         }
            //     }
            // }
            "message":{
                "text":"Please click Yes/No:",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Yes",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                  },
                  {
                    "content_type":"text",
                    "title":"No",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                  }
                ]
              }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    } else if (categoryName == "virat kohli") {
        console.log("Virat Kohli:", categoryName);
        request({
            uri:'https://webhose.io/search?token=a5010355-3c38-4a95-854f-85b4bd499882&format=json&q=aamir%20khan%20language%3A(english)%20thread.country%3AIN%20site_category%3Aentertainment&ts=1474965527596',
          //  uri:'  https://webhose.io/search?token=a5010355-3c38-4a95-854f-85b4bd499882&format=json&q=virat%20kohli%20thread.country%3AIN%20site_category%3Asports',
        },function(error, response) {
          var webhousedata = JSON.stringify(response.body);
            console.log("Webhose_data:", webhousedata.posts);
          var webhouseres = JSON.parse(response.body);
            console.log("Webhose_response:", webhouseres.posts);
            console.log("#####Webhose_response:#######", webhouseres.posts[0].thread);
            console.log("#####Webhose_response:#######", webhouseres.posts[0].thread.title);
            console.log("#####Webhose_response:#######", webhouseres.posts[0].thread.social);
            console.log("#####Webhose_response:#######", webhouseres.posts[0].thread.social.facebook);
            console.log("#####Webhose_response:#######", webhouseres.posts[0].thread.social.facebook.likes);
          //webhouseres.forEach(function (thread) {
          //   console.log("Webhose_response data:",thread);
          // });
          // //  console.log("Webhose_response data:", response.posts.thread);
            console.log("Webhose_error data:", error);
            if (error) {
                console.log("Error While retriving content pack data from database:", error);
            }else if (response.length) {
                var senderID = event.sender.id;
                var contentList = [];
                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": response.posts.thread[i].title,
                        "image_url": response.posts.thread[i].main_image,
                        "item_url": response.posts.thread[i].main_image,
                        "buttons": [{
                            "type": "postback",
                            "title": "Read More",
                            "payload": "USER_DEFINED_PAYLOAD"
                        }]
                    };
                    contentList.push(keyMap);
                    console.log("#######################contentList",contentList);
                }
              }
            else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
        });
      } else {
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM fk_content_pack where category_id = (SELECT id FROM fk_category where name = ?)', [categoryName], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];

                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].image_url,
                        "item_url": rows[i].image_url,
                        "buttons": [{
                            "type": "postback",
                            "title": "View",
                            "payload": rows[i].id
                        }, {
                            "type": "postback",
                            "title": "Magazine",
                            "payload": "USER_DEFINED_PAYLOAD"
                        }]
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
                        }
                    }
                }
                callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
        });
    }
}


function sendHelpMessage(event) {
    var senderID = event.sender.id;
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "A lot of exciting things are awaiting for you! Get kicking!",
                    "buttons": [{
                        "type": "postback",
                        "title": "Categories",
                        "payload": "Categories"
                    }, {
                        "type": "postback",
                        "title": "Fan Clubs",
                        "payload": "Fan Clubs"
                    }, {
                        "type": "postback",
                        "title": "Fan Magazine",
                        "payload": "Fan Magazine"
                    }]
                }
            }
        }
    }
    callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
}







function callSendAPI(body, url) {
    console.log("url", url);
    console.log("Body", body);
    request({
        uri: url,
        qs: {
            access_token: fbpage_access_token
        },
        method: 'POST',
        json: body,
        headers: {
            "Content-Type": "application/json"
        }
    }, function(error, response, body) {
        console.log("Response data: ", JSON.stringify(body));
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

app.listen(process.env.PORT);

'use strict';
var request = require('request');
//var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 2,
    host: 'ap-cdbr-azure-southeast-a.cloudapp.net',
    user: 'bb603e8108da6e',
    password: '3e384329',
    database: 'rankworlddev'
});
//app.use(bodyParser.json());
console.log("------:thread:-----");

const sendContentPacks = (categoryName,event) => {
  console.log("*************---categoryName----*******", categoryName );
    if (categoryName == "Categories") {
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":"We have Fankick content on the following, why not try them out?",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Politics",
                    "payload":"Politics"
                  },
                  {
                    "content_type":"text",
                    "title":"Celebrities",
                    "payload":"Celebrities"
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
                    "title":"Fan Magazine",
                    "payload":"Fan Magazine"
                  },
                  {
                    "content_type":"text",
                    "title":"What can you do?",
                    "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                  }

                ]
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
                        "item_url": rows[i].imageurl
                        // "buttons": [{
                        //     "type": "web_url",
                        //     "url": rows[i].wiki_url,
                        //     "title": "Read More"
                        // }]
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
                          "quick_replies": quickMenu
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
            console.log("*************************-after", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].imageurl,
                        "item_url": rows[i].imageurl
                        // "buttons": [{
                        //     "type": "postback",
                        //     "title": "Read More",
                        //     "payload": "USER_DEFINED_PAYLOAD"
                        // }]
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
                        "quick_replies": quickMenu
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
    } else if (categoryName == "Movies") {
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj);
      if (moviesObj.length){
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj.length);
        var senderID = event.sender.id;
        var contentList = [];
        for (var i = 0; i < moviesObj.length; i++) { //Construct request body
            var keyMap = {
                "title":"We have some cool stuff waiting for you..",
                // "image_url": moviesObj[i].qus,
                // "item_url": moviesObj[i].qus
                "buttons": [{
                    "type": "postback",
                    "title": moviesObj[i].name,
                    "payload": "USER_DEFINED_PAYLOAD"
                },
                {
                    "type": "postback",
                    "title": moviesObj[i].qus,
                    "payload": "USER_DEFINED_PAYLOAD"
                }]
            };
            contentList.push(keyMap);
        }
        var messageData = {
            "recipient": {
                "id": senderID
            },
            // "message": {
            //     "attachment": {
            //         "type": "template",
            //         "text":"We have some cool stuff waiting for you..",
            //         "payload": {
            //             "template_type": "generic",
            //             "elements": contentList
            //         }
            //     },
            //     "quick_replies": quickMenu
            // }
              "message":{
                  "text":"Here is some cool and interesting stuff on movies",
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Quizzes",
                      "payload":"Quizzes"
                    },
                    {
                      "content_type":"text",
                      "title":"Fan Clubs",
                      "payload":"Fan Clubs"
                    },
                    {
                      "content_type":"text",
                      "title":"Gossip Corner",
                      "payload":"Gossip Corner"
                    },
                    {
                      "content_type":"text",
                      "title":"Fan Magazine",
                      "payload":"Fan Magazine"
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
    }else {
        console.log("No Data Found From Database");
        sendHelpMessage(event);
    }
    }  else if (categoryName == "Sports") {
      if (categoryName == "Sports"){
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":"Here is some cool and interesting stuff on sports",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Quizzes",
                    "payload":"Quizzes"
                  },
                  {
                    "content_type":"text",
                    "title":"Cricket",
                    "payload":"Cricket"
                  },
                  {
                    "content_type":"text",
                    "title":"Football",
                    "payload":"Football"
                  },
                  {
                    "content_type":"text",
                    "title":"Baseball",
                    "payload":"Baseball"
                  },
                  {
                    "content_type":"text",
                    "title":"Basketball",
                    "payload":"Basketball"
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
    }else {
        console.log("No Data Found From Database");
        sendHelpMessage(event);
    }
    }else if (categoryName == "Politics") {
      if (categoryName == "Politics"){
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":"Here is some cool and interesting stuff on politics",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Quizzes",
                    "payload":"Quizzes"
                  },
                  {
                    "content_type":"text",
                    "title":"News",
                    "payload":"News"
                  },
                  {
                    "content_type":"text",
                    "title":"News",
                    "payload":"News"
                  },
                  {
                    "content_type":"text",
                    "title":"News",
                    "payload":"News"
                  },
                  {
                    "content_type":"text",
                    "title":"News",
                    "payload":"News"
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
    }else {
        console.log("No Data Found From Database");
        sendHelpMessage(event);
    }
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
                        "item_url": rows[i].image_url
                      //   "buttons": [{
                      //       "type": "postback",
                      //       "title": "View",
                      //       "payload": rows[i].id
                      //   }
                      //   // , {
                      //   //     "type": "postback",
                      //   //     "title": "Magazine",
                      //   //     "payload": "USER_DEFINED_PAYLOAD"
                      //   // }
                      // ]
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
                        "quick_replies":quickMenu
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





module.exports = {
  sendContentPacks: sendContentPacks
};

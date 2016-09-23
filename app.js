var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
//let wit = require('node-wit').Wit;
//let log = require('node-wit').log;
//const bot = require('./wit.js');
const fetch = require('node-fetch');
const crypto = require('crypto');
var connection = mysql.createConnection({
    host: 'ap-cdbr-azure-southeast-a.cloudapp.net',
    user: 'bb603e8108da6e',
    password: '3e384329',
    database: 'rankworlddev'
});
//var a = require('./wit.js').initValue;
//bot.myvar = 'Hello world**********Hello world';
//bot.test();
//var name = bot.name;
//var name123 = bot.witvalue;
//var value_1232 = bot.value_123;
//console.log("#############namenamenamenamename#############",name);
//console.log("#############namenamenamenamename#############",name123);
//console.log("#############namenamenamenamename#############",value_1232);
//const witbot = wit.getWit();
var wit_text;
// Wit.ai parameters
const WIT_TOKEN = process.env.WIT_TOKEN;
// const fbwittest = (msgwit_value) => {
//   console.log("================Hi Welcome to Wit========================",msgwit_value);
// };

// bot.displayName() {
//
// };
//var initValue = 0;

// It has functions
//console.log("==================================",a);
//console.log("************************",initValue);
// Call them
//console.log(a.addOne());
//console.log(a.subtractOne());
connection.connect(function(error) {
    if (error) {
        console.log("Error conecting to db", error);
    }
    console.log("connection successfully");
});

app.use(bodyParser.json());

app.get("/hello", function(req, res) {
  res.send('welcome to chat bot');
});

app.get('/webhook', function(req, res) {
    console.log("Validating webhook", console.log(JSON.stringify(req.body)));
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === 'login_type') {
        res.status(200).send(req.query['hub.challenge']);
        console.log("Validating webhook", console.log(JSON.stringify(req.body)));
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.post('/webhook', function(req, res) {
    var data = req.body;
    console.log("WIT_TOKEN=", data);
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
                        receivedMessage(messagingEvent);
                    }
                    //var msgText = messagingEvent.message.text;
                    console.log("messaging:------",messagingEvent);
                    //textmessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    //receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                    //sendGenericMessage(messagingEvent);
                  //  var payloadText = messagingEvent.postback.payload;
                     textpayload(messagingEvent);
                } else if (messagingEvent.read) {
                    //console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                } else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                    console.log("sample");
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

// message text section Start ********************************************
function textmessage(msgwit, messagingEvent){
    var msgText = messagingEvent.message.text;
  console.log("messaging_message:------",messagingEvent.message);
  console.log("messaging_message_text:------",messagingEvent.message.text);
  console.log("messaging_msgText:------",msgText);
  console.log("messaging_msgText:------:------",msgwit);
};
// message text section Start ********************************************

// postback payload section Start ********************************************
function textpayload(messagingEvent){
  var categoryName = messagingEvent.postback.payload;
  console.log("postback_sender_id:------",messagingEvent.sender.id);
  console.log("postback_postback:------",messagingEvent.postback);
  console.log("postback_postback_payload:------",messagingEvent.postback.payload);
  console.log("postback_payloadText:------",categoryName);
  //console.log("$$$$$----messageText", messageText);
  var packId = parseInt(categoryName);
  // var packId = parseInt(messageText);
  console.log("$$$$$---packId", packId );
  if (isNaN(packId)) {
    console.log("packId*************Text", packId );
    //sendContentPacks(msg, event);
    //  sendContentPacks(messageText, event);
  } else {
    console.log("packId*************Number", packId );
    console.log("packId*************Number1", messagingEvent );
      sendContentPackItems(packId, messagingEvent);
  }


  console.log("*************---categoryName----*******", categoryName );
      if (categoryName == "Categories") {
          var senderID = messagingEvent.sender.id;
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
          callSendAPI(messageData);
      } else if (categoryName == "Fan Clubs") {
          connection.query('SELECT * FROM fk_pack_fanclub', function(err, rows) {
              if (err) {
                  console.log("Error While retriving content pack data from database:", err);
              } else if (rows.length) {
                  var senderID = messagingEvent.sender.id;
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
                  callSendAPI(messageData);
              } else {
                  console.log("No Data Found From Database");
                  sendHelpMessage(messagingEvent);
              }
          });
      } else if (categoryName == "Fan Magazine") {
          //console.log("***************************", categoryName);
          connection.query('SELECT * FROM fk_pack_fan_magazines', function(err, rows) {
              //console.log("*************************-after", categoryName);
              //console.log("*************************-after", rows);
              if (err) {
                  console.log("Error While retriving content pack data from database:", err);
              } else if (rows.length) {
                  var senderID = messagingEvent.sender.id;
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
                  callSendAPI(messageData);
              } else {
                  console.log("No Data Found From Database");
                  sendHelpMessage(messagingEvent);
              }
          });
      } else if (categoryName == "Yes") {
          var senderID = messagingEvent.sender.id;
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
          callSendAPI(messageData);
      } else if (categoryName == "No") {
          var senderID = messagingEvent.sender.id;
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
                              //  "title": "Welcome to FanKick",
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
          callSendAPI(messageData);
      } else {
          connection.query('SELECT * FROM fk_content_pack where category_id = (SELECT id FROM fk_category where name = ?)', [categoryName], function(err, rows) {
              if (err) {
                  console.log("Error While retriving content pack data from database:", err);
              } else if (rows.length) {
                  var senderID = messagingEvent.sender.id;
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
                  callSendAPI(messageData);
              } else {
                  console.log("No Data Found From Database");
                  sendHelpMessage(messagingEvent);
                  //sendImageMessage(event);
              }
          });
      }

};

// postback payload section End ********************************************

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
    //getMessageFromWitAPI(messageText);
    console.log("*************messageText*************",messageText);
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //function getMessageFromWitAPI(message) {
      var msgwit = messageText;
      //bot.getwitmessageText(msgwit);

      //var tb3;
        request({
            uri: 'https://api.wit.ai/message?v=20160526&q='+ msgwit,
            headers: {
                "Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX"
            }
        }, function(error, response) {
            if (error) {
                console.log("Error While geting response from Wit:", error);
            } else {
              var res = JSON.stringify(response);
              var res_data = response.body;
              var wit_res_data = JSON.parse(res_data);
              var wit_res_data_ent = wit_res_data.entities;
              var wit_res_data_intent =  wit_res_data_ent.intent;
              var wit_res_data_location = wit_res_data_ent.location;
              var wit_res_msg_id = wit_res_data.msg_id;

                console.log("Response from Wit--Res", res);
                //console.log("Response from Wit--response", response);
                console.log("Response from Wit--msg_id", wit_res_data.msg_id);
                console.log("Response from Wit************1", wit_res_data.entities);
                console.log("Response from Wit************2", wit_res_data_ent.intent);
                console.log("Response from Wit************3", wit_res_data_ent.location);
                console.log("Response from Wit************4", wit_res_data_intent);
                console.log("Response from Wit************5", wit_res_data_location);
                //console.log("Response from Wit************6", wit_res_data_intent.value);
                //var intentlength = wit_res_data_intent.length;
                if(JSON.stringify(wit_res_data_ent) === '{}') { //This will check if the object is empty
                  //sendHelpMessage(event);
                  textmessage(msgwit, event)
                  sendContentPacks(msgwit, event)
                  console.log("wit_res_data_intent.length is Zero", wit_res_data_ent);
                  console.log("wit_res_data_intent.length is Zero", event);
                }else{
                for(var i=0;i<wit_res_data_intent.length;i++)
                {
                  var td1=wit_res_data_intent[i]["confidence"];
                  var td2=wit_res_data_intent[i]["type"];
                  var td3=wit_res_data_intent[i]["value"];
                }
                console.log("confidence************5",td1);
                console.log("type************5",td2);
              console.log("value************5", td3);
              msgwit_value = td3;
              console.log('******msgwit_value', msgwit_value);
            //  bot.getwitmsg(wit_res_msg_id,msgwit_value,msgwit);
              getwitmsgifcondition(msgwit_value);
            //  bot.wittest(msgwit_value);
            }

            }
        });

function getwitmsgifcondition(msgwit_value) {
  if (msgwit_value) {
    console.log('msgwit_value******msgwit_value', msgwit_value);
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      switch (msgwit_value) {
          case 'image':
              sendImageMessage(event);
              break;

          case 'button':
              sendButtonMessage(senderID);
              break;

          case 'generic':
              sendGenericMessage(senderID);
              break;

              //  case 'account linking':
              //       sendAccountLinking(senderID);
              //       break;

          case 'receipt':
              sendReceiptMessage(senderID);
              break;

          default:
              sendGenericMessage(event, msgwit_value);
      }
  } else if (messageAttachments) {
      var attachementType = messageAttachments[0]
      switch (attachementType.type) {
          case 'image':
              sendImageMessage(event)
              break;

          default:
      }
  }
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
    callSendAPI(messageData);
}

function sendGenericMessage(event, msg) {
     console.log("$$$$$----event", event);
     console.log("$$$$$----event111", event.hasOwnProperty('message'));
     //console.log("$$$$$----event111", event.message.text);
     console.log("$$$$$----event111", msg);
     //console.log("$$$$$----event111", event.postback.payload);

    var messageText = event.hasOwnProperty('message') ? event.msg : event.postback.payload;
  //   var messageText = event.hasOwnProperty('message') ? event.message.text : event.postback.payload;
    console.log("$$$$$----messageText", messageText);
 var packId = parseInt(msg);
    // var packId = parseInt(messageText);
    console.log("$$$$$---packId", packId );
    if (isNaN(packId)) {
      sendContentPacks(msg, event);
      //  sendContentPacks(messageText, event);
    } else {
        //sendContentPackItems(packId, event);
    }
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
        callSendAPI(messageData);
    } else if (categoryName == "Fan Clubs") {
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
                callSendAPI(messageData);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
        });
    } else if (categoryName == "Fan Magazine") {
        //console.log("***************************", categoryName);
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
                callSendAPI(messageData);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
            }
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
        callSendAPI(messageData);
    } else if (categoryName == "No") {
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
                            //  "title": "Welcome to FanKick",
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
        callSendAPI(messageData);
    } else {
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
                callSendAPI(messageData);
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
        });
    }
}

function sendContentPackItems(packId, messagingEvent) {
    //connection.query('select distinct item_id,item_name,item_type,item_image_url from fk_pack_multiple_item where pack_id = ? union all select distinct item_id,item_name,item_type,iteam_image_url from fk_pack_poll_item where pack_id = ?', [packId,packId], function(error, rows) {
    connection.query('Select poll.item_name,poll.item_type,poll.iteam_image_url,poll.left_text,poll.right_text from rankworlddev.fk_pack_poll_item As poll Inner Join rankworlddev.fk_pack_content_items On rankworlddev.fk_pack_content_items.id = poll.item_id where rankworlddev.fk_pack_content_items.pack_id = ?', [packId], function(error, rows) {
        if (error) {
            console.log('error while retriving content pack items from database', error);
        } else if (rows.length > 0) {
            var senderID = messagingEvent.sender.id;
            var contentList = [];
            for (var i = 0; i < rows.length; i++) { //Construct request body
                if (rows[i].item_type == 'Poll') {
                    //var it = 'Poll';
                    var keyMap = {
                        "title": rows[i].item_name,
                        "image_url": rows[i].iteam_image_url,
                        "item_url": rows[i].iteam_image_url,
                        "buttons": [{
                            "type": "postback",
                            "title": rows[i].left_text,
                            "payload": rows[i].left_text
                        }, {
                            "type": "postback",
                            "title": rows[i].right_text,
                            "payload": rows[i].right_text
                        }]
                    };
                } else {
                    var keyMap = {
                        "title": rows[i].item_name,
                        "image_url": rows[i].item_image_url,
                        "item_url": rows[i].item_image_url,
                        "buttons": [{
                            "type": "postback",
                            "title": "Read More",
                            "payload": "DEVELOPER_DEFINED_PAYLOAD"
                        }]
                    };
                }
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
            callSendAPI(messageData);
        }
    });
}



function sendImageMessage(event) {
    var senderID = event.sender.id;
    var image = "image"
    var attachments = event.message.attachments[0] //"https://fankickdev.blob.core.windows.net/images/0C534ECC-3239-467E-A7AF-2B7926CA8588"
    var imageUrl = attachments.payload.url;

    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "attachment": {
                "type": image,
                "payload": {
                    "url": imageUrl
                }
            }
        }
    };
    callSendAPI(messageData);
}

function sendTextMessage(recipientId, messageText) {
    var messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
            "text": messageText
        }
    };
    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/592208327626213/messages',
        qs: {
            access_token: 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD'
        },
        method: 'POST',
        json: messageData

    }, function(error, response, body) {
        //console.log("Response data: ",JSON.stringify(body));
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

// const wit2 = bot.getWit();
// console.log("======================botgetWit===========================",wit2)

app.listen(process.env.PORT);
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

//module.exports = app;

module.exports = {
  // test1: function() {
  //     console.log('var is', this.myvar);
  // }
  //fbwittest: fbwittest
  // getWit:getWit
};
//connection.end();

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fetch = require('node-fetch');
const crypto = require('crypto');
const thread = require('./modules/thread.js');
const payloadText = require('./modules/payload.js');
const searchText = require('./modules/search.js');
var googleTrends = require('google-trends-api');
//const bot = require('./wit.js');

var pool = mysql.createPool({
    connectionLimit : 1,
    host: 'ap-cdbr-azure-southeast-a.cloudapp.net',
    user: 'bb603e8108da6e',
    password: '3e384329',
    database: 'rankworlddev'
});
var quickMenu = [
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
      "title":"TV Shows",
      "payload":"TV Shows"
    },
    {
      "content_type":"text",
      "title":"Music",
      "payload":"Music"
    }
];

app.use(bodyParser.json());
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';

var quickMenu = payloadText.quickMenu;

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
                      if(messagingEvent.message.quick_reply == undefined){
                        console.log("1messaging quick_reply payload:------", messagingEvent.message.text);
                        receivedMessage(messagingEvent);
                      }else{
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

    console.log("???????????????????????categoryName?????????????????????",categoryName);

    var myarray = categoryName.split(',');
    //var a = '2008, 1993';
    //var array = a.split(',');
    var b = parseInt(myarray[0]);
    var c = parseInt(myarray[1]);
    console.log("???????????????????????.split?????????????????????",b , c);

    // for(var i = 0; i < myarray.length; i++)
    // {
    //    console.log(myarray[i]);
    //    var celname = myarray[i];
    //    console.log(myarray[i]);
    //   var moviearray = {
    //      "content_type":"text",
    //      "title":myarray[i],
    //      "payload":myarray[i]
    //    }
    //    quickList.push(moviearray);
    // }


    var packId = parseInt(categoryName);
    if (isNaN(packId)) {
        //sendContentPacks(messageText, event);
        var res = categoryName.toLowerCase();
        console.log("********************************************************",res);
        //payloadText.sendContentPacks(categoryName, messagingEvent);
        payloadText.sendContentPacks(res, messagingEvent);
    } else if (categoryName == "Quizzes") {
        quizzesPacks(categoryName, messagingEvent);
        console.log("categoryName########", categoryName);
    }else {
        //sendContentPackItems(packId, messagingEvent);
        celebrityid(packId, messagingEvent);
        console.log("postback_sender_id:------", packId);
    }
    console.log("postback_sender_id:------", userid);
    // if (categoryName == "Get Started") {
    //     //greetingtext(messagingEvent,Get Started);
    //     thread.persistentMenu(fbpage_access_token);
    //     fbuserdetails(messagingEvent, userid);
    //     //sendTextMessage(userid, 'Get Started');
    //     console.log("categoryName", categoryName);
    //     //getStarted();
    // }else if (categoryName == "Ok Goon") {
    //     mainPacks(categoryName, messagingEvent);
    //     console.log("categoryName", categoryName);
    // }
    // // else if (categoryName == "Quizzes") {
    // //     quizzesPacks(categoryName, messagingEvent);
    // //     console.log("categoryName########", categoryName);
    // // }
    // else{
    //   payloadText.sendContentPacks(categoryName, messagingEvent);
    // }
}


// postback payload section end ********************************************

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

      var msgwit = messageText;
      console.log("*************messageText*************",messageText);

      //bot.getwitmessageText(msgwit);

      //var tb3;
        request({
            uri: 'https://api.wit.ai/message?v=20161020&q='+ msgwit,
            headers: {
                //"Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX"
              "Authorization":  "Bearer LZ7DCQVUW3FWMSF4MAD35CSYUCMOW2W4"
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
                  //sendContentPacks(msgwit, event)
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
              msgwit_value = td3.toLowerCase();
              console.log('******msgwit_value', msgwit_value);
             //bot.getwitmsg(wit_res_msg_id,msgwit_value,msgwit);
              receivedtextmessage(msgwit_value, event);
            //  bot.wittest(msgwit_value);
            }
            }
        });
}

function sendContentPackItems(packId, event) {
    //connection.query('select distinct item_id,item_name,item_type,item_image_url from fk_pack_multiple_item where pack_id = ? union all select distinct item_id,item_name,item_type,iteam_image_url from fk_pack_poll_item where pack_id = ?', [packId,packId], function(error, rows) {
pool.getConnection(function(err, connection) {
    connection.query('Select poll.item_name,poll.item_type,poll.iteam_image_url,poll.left_text,poll.right_text from rankworlddev.fk_pack_poll_item As poll Inner Join rankworlddev.fk_pack_content_items On rankworlddev.fk_pack_content_items.id = poll.item_id where rankworlddev.fk_pack_content_items.pack_id = ?', [packId], function(error, rows) {
        if (error) {
            console.log('error while retriving content pack items from database', error);
        } else if (rows.length > 0) {
            var senderID = event.sender.id;
            var contentList = [];
            for (var i = 0; i < rows.length; i++) { //Construct request body
                if (rows[i].item_type == 'Poll') {
                    //var it = 'Poll';
                    var keyMap = {
                        "title": rows[i].item_name,
                        "image_url": rows[i].iteam_image_url,
                        //"item_url": rows[i].iteam_image_url,
                        "buttons": [{
                            "type": "postback",
                            "title": rows[i].left_text,
                            "payload": rows[i].left_text
                        }, {
                            "type": "postback",
                            "title": rows[i].right_text,
                            "payload": rows[i].right_text
                        },{
                            "type": "postback",
                            "title": "No",
                            "payload": "rows[i].right_text"
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
                    },
                      "quick_replies": quickMenu
                }
            }
            callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
        }
        connection.release();
    });
  });
}

//celebritiesdetails***************************************************
function celebrityid(categoryName,event){

  pool.getConnection(function(err, connection) {
    //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
    connection.query('select * from cc_celebrity_preference where id = ?',[categoryName], function(err, rows) {
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
              var readmorebtn = (usercelebrityName +",").concat(movi);
                var keyMap = {
                    "title": rows[i].celebrityName,
                    "image_url": rows[i].celebrityImageUrl,
                    "subtitle":rows[i].description,
                  //  "item_url": rows[i].image_url,
                    "buttons":[{
                        "type": "postback",
                        "title": "Read More",
                        "payload": readmorebtn
                    }]
                };
                contentList.push(keyMap);
                movieslist = rows[i].lastFiveMovies;
                console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%",movieslist);
            }
            updateusercelebrity(usercelebrityName,senderID);
            var myarray = movieslist.split(',');
            for(var i = 0; i < myarray.length; i++)
            {
               console.log(myarray[i]);
              //  var res1 = myarray[i].concat(myarray[i]);
              //  console.log(res1);
              var moviearray = {
                 "content_type":"text",
                 "title":myarray[i]+" %%",
                 "payload":myarray[i]
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
                    "quick_replies":quickList
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
//celebritiesdetails ends***************************************************
function updateusercelebrity(usercelebrityName,senderID){
  console.log("******************categoryName*************",usercelebrityName);
  console.log("******************senderID*************",senderID);
      pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set favCelebrity= ? where facebookId=?',[usercelebrityName,senderID], function(err, rows) {
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



function quickpayload(messagingEvent){
  console.log("entered in the quickpayload function");
  var quicktext = messagingEvent.message.quick_reply;
  var quickpayloadtext = replytext.payload;
  var userid = messagingEvent.sender.id;
  var sear = quickpayloadtext.search("%%");
             if(sear == -1)
             {
               console.log("NOOOOOOOOO");
               receivedMessage(messagingEvent);
             }else{
               //console.log("Yessssssss");
               var txt = quickpayloadtext.replace(" %%","");
               console.log("Yessssssss", txt);
             }

}


function mainPacks(categoryName, event){
  var senderID = event.sender.id;
  var messageData = {
      "recipient": {
          "id": senderID
      },
      "message":{
          "text":"Hey..Choose what excites you more",
          "quick_replies":[
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
                "title":"TV Shows",
                "payload":"TV Shows"
              },
              {
                "content_type":"text",
                "title":"Music",
                "payload":"Music"
              }
          ]
        }
  }
  callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
}

// Quick_reply payload section Start ********************************************
function receivedtextmessage(categoryName, event) {
    //var categoryName = messagingEvent.message.text;
    var userid = event.sender.id;
    var categoryName = categoryName.toLowerCase();
    //var quickButton =
      console.log("quickButton_postback:------", categoryName);
      console.log("postback_sender_id:------", userid);
      if (categoryName == "Quizzes") {
         quizzesPacks(categoryName, event);
         console.log("categoryName########", categoryName);
     }else
     if (categoryName == "Content Pack 1") {
       questionsPacks(1, event);
     }else if (categoryName == "Content Pack 2"){
       questionsPacks(2, event);
     }else if (categoryName == "Content Pack 3"){
       questionsPacks(3, event);
     }else{
       payloadText.sendContentPacks(categoryName, event);
       //searchText.googleSearchPacks(categoryName, event);
     }
}
// Quick_reply payload section End ********************************************
function textmessage(msgwit, messagingEvent){
  var msgText = messagingEvent.message.text;
  console.log("messaging_message:------",messagingEvent.message);
  console.log("messaging_message_text:------",messagingEvent.message.text);
  console.log("messaging_msgText:------",msgText);
  console.log("messaging_msgText:------:------",msgwit);
  //payloadText.sendContentPacks(msgText, messagingEvent);
  receivedtextmessage(msgText, messagingEvent);
};
// QuizzesPacks payload section Start ********************************************
function quizzesPacks(categoryName, event) {
  var senderID = event.sender.id;
  var messageData = {
      "recipient": {
          "id": senderID
      },
      "message":{
          "text":"Answer these Kicking Questions!!",
          "quick_replies":[
            {
              "content_type":"text",
              "title":"Content Pack 1",
              "payload":"Content Pack 2"
            },
            {
              "content_type":"text",
              "title":"Content Pack 2",
              "payload":"Content Pack 2"
            },
            {
              "content_type":"text",
              "title":"Content Pack 3",
              "payload":"Content Pack 3"
            },
            {
              "content_type":"text",
              "title":"Categories",
              "payload":"Categories"
            }
            // ,
            // {
            //   "content_type":"text",
            //   "title":"What can you do?",
            //   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
            // }
          ]
        }
  }
  callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
}
// QuizzesPacks payload section End ********************************************
// QuestionsPacks payload section Start ********************************************
function questionsPacks(categoryName, event) {
//  var qusCategories = categoryName;
  // var senderID = event.sender.id;
  // if(categoryName == "Content Pack 1"){
  //   categoryName = 1;
  // } else if (categoryName == "Content Pack 2"){
  //   categoryName = 2;
  // } else (categoryName == "Content Pack 3"){
  //   categoryName = 3;
  // }

  pool.getConnection(function(err, connection) {
  connection.query('SELECT * FROM fk_pack_multiple_item where type=? and pack_id in (select id from fk_content_pack where category_id=?)', ['Question',categoryName], function(err, rows) {
      //console.log("*************************-after", categoryName);
      console.log("*************************questionsPacks", rows);
      if (err) {
          console.log("Error While retriving content pack data from database:", err);
      } else if (rows.length) {
          var senderID = event.sender.id;
          var contentList = [];
          // for (var i = 0; i < 5; i++) { //Construct request body
          //     var keyMap = {
          //         "title": rows[i].item_name,
          //         "image_url": rows[i].imageurl,
          //         "item_url": rows[i].imageurl
          //         // "buttons": [{
          //         //     "type": "postback",
          //         //     "title": "Read More",
          //         //     "payload": "USER_DEFINED_PAYLOAD"
          //         // }]
          //     };
          //     contentList.push(keyMap);
          // }
          var messageData = {
              "recipient": {
                  "id": senderID
              },
              "message":{
                  "text":rows[3].item_name,
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":rows[3].text1_content,
                      "payload":"1"
                    },
                    {
                      "content_type":"text",
                      "title":rows[3].text2_content,
                      "payload":"2"
                    },
                    {
                      "content_type":"text",
                      "title":rows[3].text3_content,
                      "payload":"3"
                    },
                    {
                      "content_type":"text",
                      "title":rows[3].text4_content,
                      "payload":"4"
                    },
                    {
                      "content_type":"text",
                      "title":"Categories",
                      "payload":"Categories"
                    }
                  ]
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
}
// QuestionsPacks payload section End ********************************************

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



// function fbuserdetails(event, userid) {
//     var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
//     console.log("url", url);
//     request({
//         "uri": url,
//         "method": 'GET'
//
//     }, function(error, response, body) {
//         var userprofiledata = JSON.parse(response.body);
//         var username = userprofiledata.first_name;
//         //console.log("--------:Response data:-------- ", JSON.stringify(body));
//         console.log("--------:Response data:--------first_name ", userprofiledata.first_name);
//         console.log("--------:Response data:--------last_name ", userprofiledata.last_name);
//         console.log("--------:Response data:--------locale ", userprofiledata.locale);
//         console.log("--------:Response data:--------timezone", userprofiledata.timezone);
//         console.log("--------:Response data:--------gender ", userprofiledata.gender);
//         var senderID = event.sender.id;
//         //var msg = 'Hi '+username+', A lot of exciting things are awaiting for you! Get kicking!';
//         //var msg = 'Hi '+username+'! My name is Kicker.\n How may I come of any help to you today?';
//     var msg = 'Hi '+username+'! My name is Kicker.\n \nI can help you get closer to your favorite celebrity with a lot of exciting things about them.\n\n Choose what excites you more';
//   //var msg = 'Hi '+username+'! My name is Kicker.';
//         console.log("--------:Response data:--------msg1 ", msg);
//         var messageData = {
//             "recipient": {
//                 "id": senderID
//             },
//             "message":{
//                 "text":msg,
//                 "quick_replies":[
//                   {
//                     "content_type":"text",
//                     "title":"Categories",
//                     "payload":"Categories"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Fan Clubs",
//                     "payload":"Fan Clubs"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Fan Magazine",
//                     "payload":"Fan Magazine"
//                   }
//                   // ,
//                   // {
//                   //   "content_type":"text",
//                   //   "title":"What can you do?",
//                   //   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
//                   // }
//                 ]
//
//               }
//             }
//          callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
//          //fbuserdetailsSecond(event, userid);
//
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




function sendHelpMessage(event){
    var userid = event.sender.id;
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
        var msg = 'Hey '+username+', I am expecting a lot of noise, select the domain...';
        //var msg = 'Hey '+username+', How are you?';
        console.log("--------:Response data:--------sendHelpMessage1", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },

            "message":{
                "text":msg,
                //"text":"msg",
                "quick_replies":[
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
                      "title":"TV Shows",
                      "payload":"TV Shows"
                    },
                    {
                      "content_type":"text",
                      "title":"Music",
                      "payload":"Music"
                    }
                ]
              }
            }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
         //sendHelpMessageSecond(event, userid);
         if (!error && response.statusCode == 200) {
             var recipientId = body.recipient_id;
             var messageId = body.message_id;
             console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
             //searchText.sendHelpMessageSecond(event, userid);

         } else {
             console.error("Unable to send message.");
             //console.error(response);
             console.error("Error while sending message:", error);
         }
    });
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

var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fetch = require('node-fetch');
const crypto = require('crypto');
app.use(bodyParser.json());
var fbpage_access_token ='EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';

app.get('/webhook', function(req, res) {
    console.log("Validating webhook", console.log(JSON.stringify(req.body)));
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
                        receivedMessage(messagingEvent);
                    }
                    //var msgText = messagingEvent.message.text;
                    console.log("messaging :------",messagingEvent);
                    //textmessage(messagingEvent);
                } else if (messagingEvent.delivery) {
                    //receivedDeliveryConfirmation(messagingEvent);
                } else if (messagingEvent.postback) {
                     receivedpostback(messagingEvent);
                     console.log("postback :------",messagingEvent);
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

// postback payload section Start ********************************************
function receivedpostback(messagingEvent){
  var categoryName = messagingEvent.postback.payload;
  var userid = messagingEvent.sender.id;
  console.log("postback_sender_id:------",userid);
  if(messagingEvent.postback.payload == "Get Started"){
    //greetingtext(messagingEvent,Get Started);
    fbuserdetails(messagingEvent);
  }
  // console.log("postback_sender_id:------",messagingEvent.sender.id);
  // console.log("postback_postback:------",messagingEvent.postback);
  // console.log("postback_postback_payload:------",messagingEvent.postback.payload);
  // console.log("postback_payloadText:------",categoryName);
  //console.log("$$$$$----messageText", messageText);
  var packId = parseInt(categoryName);
  // var packId = parseInt(messageText);
  console.log("$$$$$---packId", packId );
  if (isNaN(packId)) {
    console.log("packId*************Text", packId );
    sendContentPacks(categoryName, messagingEvent);
    //  sendContentPacks(messageText, event);
  } else {
    console.log("packId*************Number", packId );
    console.log("packId*************Number1", messagingEvent );
      sendContentPackItems(packId, messagingEvent);
  }
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
    callSendAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
}

function fbuserdetails(body,url) {
    request({
        uri: "https://graph.facebook.com/v2.6/<USER_ID>?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=PAGE_ACCESS_TOKEN",
        qs: {
            access_token:'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD'
        },
        method: 'POST',
        json: body

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



function callSendAPI(body,url) {
    request({
        uri: url,
        qs: {
            access_token:'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD'
        },
        method: 'POST',
        json: body

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

app.listen(process.env.PORT);

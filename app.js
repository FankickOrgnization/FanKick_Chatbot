var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var mysql = require('mysql');
const fetch = require('node-fetch');
const crypto = require('crypto');
app.use(bodyParser.json());
var fbpage_access_token = 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';

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
                        //receivedMessage(messagingEvent);
                    }
                    //var msgText = messagingEvent.message.text;
                    console.log("messaging :------", messagingEvent);
                    //textmessage(messagingEvent);
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
        fbuserdetails(userid);
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

function fbuserdetails(userid) {
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.stringify(body);
        //console.log("--------:Response data:-------- ", JSON.stringify(body));
        console.log("--------:Response data:--------first_name ", userprofiledata.first_name);
        console.log("--------:Response data:--------last_name ", userprofiledata.last_name);
        console.log("--------:Response data:--------locale ", userprofiledata.locale);
        console.log("--------:Response data:-------- timezone", userprofiledata.timezone);
        console.log("--------:Response data:--------gender ", userprofiledata.gender);

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

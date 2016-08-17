var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === 'login_type') {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);
  }
});

app.post('/webhook', function (req, res) {
  var data = req.body;
  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {
        console.log("messaging event:",JSON.stringify(messagingEvent));

        if (messagingEvent.optin) {
          //receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          //receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          //receivedPostback(messagingEvent);
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

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;
  var messageId = message.mid;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  console.log("Message Text",messageText);

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'image':
        sendImageMessage(event);
        break;
        case 'button':
                sendButtonMessage(senderID);
                break;

              case 'generic':
                sendGenericMessage(senderID);
                break;

              case 'receipt':
                sendReceiptMessage(senderID);
                break;

              default:
                sendTextMessage(senderID, messageText);
            }
          } else if (messageAttachments) {
            var attachementType = messageAttachments[0]
            console.log("Attachment Type:", attachementType);
            switch (attachementType.type) {
              case 'image':
                sendImageMessage(event)
                break;
              default:
            }
          }
  }

  function sendImageMessage(event) {
    var senderID = event.sender.id;
    var image = "image"
    var attachments = event.message.attachments[0]//"https://fankickdev.blob.core.windows.net/images/0C534ECC-3239-467E-A7AF-2B7926CA8588"
    var imageUrl = attachments.payload.url;
    console.log("Image URL:", imageUrl);
    var messageData = {
      "recipient": {
        "id": senderID
      },
      "message": {
        "attachment":{"type":image,"payload":{"url":imageUrl}}
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
    qs: { access_token: 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD' },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    console.log("Response data: ",JSON.stringify(body));
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s",
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      //console.error(response);
      console.error("Error while sending message:",error);
    }
  });
}

app.listen(process.env.PORT);

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
var fbpage_access_token = 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';
//
// var name = "Narendranath";
//
// var moviesObj =  [
//   {
//     "name": "Quizzes",
//     "qus": "Name the director of PK?"
// },
// {
//     "name": "Fan Clubs",
//     "qus": "Join Pretty Alia Club"
// },
// {
//     "name": "Gossip Corner",
//     "qus": "Anupam Kher slams Om Puri???"
// },
// {
//     "name": "Fan Magazines",
//     "qus": "Johnny Depp"
// }
// ];
//
// var quickMenu = [
//   {
//     "content_type":"text",
//     "title":"Categories",
//     "payload":"Categories"
//   },
//   {
//     "content_type":"text",
//     "title":"Fan Clubs",
//     "payload":"Fan Clubs"
//   },
//   {
//     "content_type":"text",
//     "title":"Fan Magazine",
//     "payload":"Fan Magazine"
//   },
//   {
//     "content_type":"text",
//     "title":"Movies",
//     "payload":"Movies"
//   },
//   {
//     "content_type":"text",
//     "title":"Sports",
//     "payload":"Sports"
//   },
//   {
//     "content_type":"text",
//     "title":"Celebrities",
//     "payload":"Celebrities"
//   },
//   {
//     "content_type":"text",
//     "title":"What can you do?",
//     "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
//   }
// ];
// //app.use(bodyParser.json());
// //console.log("------:thread:-----");

const googleSearchPacks = (categoryName,event) => {
  console.log("*************---categoryName----*******", categoryName );
  var userid = event.sender.id;
    // var params = {
    //   'query': 'FIFA',
    //   'limit': 10,
    //   'indent': true,
    //   'key' : 'AIzaSyCavmWhCL_wMeLAKrurcVPUdP0ztgubHZc',
    // };
var url = 'https://kgsearch.googleapis.com/v1/entities:search?query=' + categoryName + '&key=AIzaSyCavmWhCL_wMeLAKrurcVPUdP0ztgubHZc&limit=5&indent=True'
  //  var url = 'https://kgsearch.googleapis.com/v1/entities:search' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
//https://kgsearch.googleapis.com/v1/entities:search?query=' + userid + '&key=AIzaSyCavmWhCL_wMeLAKrurcVPUdP0ztgubHZc&limit=10&indent=True

    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'
    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
      //  var username = userprofiledata.first_name;
        //console.log("--------:Response data:-------- ", JSON.stringify(body));
        console.log("--------:Response data:--------first_name ", userprofiledata.result);
        var row = userprofiledata.result;
        var senderID = event.sender.id;
        for (var i = 0; i < 5; i++) { //Construct request body
          console.log("--------:Response data:--------first_name ", rows[i].name);
            // var keyMap = {
            //     "title": rows[i].name,
            //     console.log("--------:Response data:--------first_name ", rows[i].name);
            //     // "image_url": rows[i].image_url,
            //     // "item_url": rows[i].image_url
            //   //   "buttons": [{
            //   //       "type": "postback",
            //   //       "title": "View",
            //   //       "payload": rows[i].id
            //   //   }
            //   //   // , {
            //   //   //     "type": "postback",
            //   //   //     "title": "Magazine",
            //   //   //     "payload": "USER_DEFINED_PAYLOAD"
            //   //   // }
            //   // ]
            // };
            // contentList.push(keyMap);
        }
        //var msg = 'Hey '+username+', How are you? \n \nDid you check these amazingly cool stuff on Fankick?';
        //console.log("--------:Response data:--------gender ", msg);
        // var messageData = {
        //     "recipient": {
        //         "id": senderID
        //     },
        //
        //     "message":{
        //         "text":msg,
        //         //"text":"msg",
        //         "quick_replies":[
        //           // {
        //           //   "content_type":"text",
        //           //   "title":"Politics",
        //           //   "payload":"Politics"
        //           // },
        //           {
        //             "content_type":"text",
        //             "title":"Celebrities",
        //             "payload":"Celebrities"
        //           },
        //           {
        //             "content_type":"text",
        //             "title":"Movies",
        //             "payload":"Movies"
        //           },
        //           {
        //             "content_type":"text",
        //             "title":"Sports",
        //             "payload":"Sports"
        //           },
        //           {
        //             "content_type":"text",
        //             "title":"Fan Clubs",
        //             "payload":"Fan Clubs"
        //           },
        //           {
        //             "content_type":"text",
        //             "title":"Fan Magazine",
        //             "payload":"Fan Magazine"
        //           }
        //
        //         ]
        //       }
        //     }
         //callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
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
        //var msg = 'Hey '+username+', How are you? \n \nDid you check these amazingly cool stuff on Fankick?';
      //  console.log("--------:Response data:--------gender ", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },

            "message":{
                "text":"HI",
                //"text":"msg",
                "quick_replies":[
                  // {
                  //   "content_type":"text",
                  //   "title":"Politics",
                  //   "payload":"Politics"
                  // },
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
                    "title":"Fan Clubs",
                    "payload":"Fan Clubs"
                  },
                  {
                    "content_type":"text",
                    "title":"Fan Magazine",
                    "payload":"Fan Magazine"
                  }

                ]
              }
            }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    });
}



module.exports = {
  googleSearchPacks: googleSearchPacks,
  // name:name,
  //quickMenu:quickMenu
};

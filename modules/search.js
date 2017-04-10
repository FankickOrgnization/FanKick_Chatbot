'use strict';
var request = require('request');
const fbRquest = require('./fbapi.js');
var fbpage_access_token = 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';
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
        "title": "TV Shows 📺",
        "payload": "TV Shows"
    }, {
        "content_type": "text",
        "title": "Music 🎶",
        "payload": "Music"
    }
];

const googlegraph = (categoryName, event) => {
    // var senderID = event.sender.id;
    // var msg = "Let's see what Google Mommy says about " + categoryName +"";
    // var messageData = {
    //     "recipient": {
    //         "id": senderID
    //     },
    //     "message": {
    //         "text": msg
    //     }
    // };
    // fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    googlegraphdetails(categoryName, event);
}


// ************************** Googlegraph api ********************************
//const googlegraph = (categoryName, event) => {
function googlegraphdetails(categoryName, event){
    console.log("*************---categoryName----*******", categoryName);
    var contentList = [];
    var quickList = [];

    var userid = event.sender.id;
    var url = 'https://kgsearch.googleapis.com/v1/entities:search?query=' + categoryName + '&key=AIzaSyCavmWhCL_wMeLAKrurcVPUdP0ztgubHZc&limit=1&indent=True'

    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'
    }, function(error, response, body) {
      console.log("***********error",error);
        var userprofiledata = JSON.parse(response.body);
        console.log("--------:googlegraphdetails Response data:--------", userprofiledata);
        console.log("--------:googlegraphdetails Response data:--------first_name ", userprofiledata.itemListElement);
        var rows = userprofiledata.itemListElement;
        var rowlen = rows.length;
        console.log("--------:Response data:--------length ", rowlen);
        var senderID = event.sender.id;
        var imagedata;
        var desdata;






        for (var i = 0; i < 1; i++) {
          desdata = rows[i].result;
          console.log("result_1",desdata);
          for(var obj in desdata){
              if(desdata.hasOwnProperty(obj)){
              for(var prop in desdata[obj]){
                  if(desdata[obj].hasOwnProperty(prop)){
               //alert(prop + ':' + jsonData[obj][prop]);
               console.log("Json properties",prop);
                  }
              }
          }
          }

          var name = rows[i].result.name;
          var articleBody = rows[i].result.detailedDescription.articleBody;
          //var contentUrl = rows[i].result.image.contentUrl;
          var url = rows[i].result.detailedDescription.url;
          console.log("googlegraphdetails.name",name);
          console.log("googlegraphdetails.articleBody",articleBody);
        //  console.log("googlegraphdetails.contentUrl",contentUrl);
          console.log("googlegraphdetails.image.url",url);

          // console.log("result.name",rows[i].result.name);
          // console.log("result.name",rows[i].result.detailedDescription.articleBody);
          // console.log("result.name",rows[i].result.image.contentUrl);
          // console.log("result.name",rows[i].result.image.url);

            var keyMap = {
                "title": rows[i].result.name,
              //  "image_url": rows[i].result.image.contentUrl,
                "subtitle": rows[i].result.detailedDescription.articleBody,
                "buttons": [
                    {
                        "type": "web_url",
                        "url": rows[i].result.detailedDescription.url,
                        "title": "Read More"
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
                "quick_replies": quickreply
            }
        }
        fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    });
}
// ************************** Googlegraph api End ********************************




module.exports = {
  googlegraph: googlegraph
};

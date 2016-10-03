'use strict';
var request = require('request');
console.log("------:thread:-----");

const output = (categoryName,event) => {
  console.log("accessToken for thread:-----", categoryName);
  console.log("accessToken for thread:-----", event);
  {
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






}

module.exports = {
  output: output
};

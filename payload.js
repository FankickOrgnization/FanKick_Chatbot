'use strict';
var request = require('request');
const searchText = require('./search.js');
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

var moviesObj =  [
  {
    "name": "Movies",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/movies.jpg'
},
{
    "name": "Celebrities",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/celebrities.jpg'
},
{
    "name": "Music",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/music.jpg'
},
{
    "name": "Sports",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sports.jpg'
}
];
var celbritieObj =  [
  {
    "name": "Pavan Kalyan",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/pk4.jpg'
},
{
    "name": "Sachin Tendulkar",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sachin4.jpg'
},
{
    "name": "Shahrukh Khan",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sharuk4.jpg'
},
{
    "name": "Aamir Khan",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/amir4.jpg'
},
{
    "name": "Virat Kohli",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/virat4.jpg'
}
];
var viratObj =  [
  {
    "name": "Quizzes",
    "des" : "How well do you know about your celebrities?",
    "subdesc" : "Find out by taking this quiz!",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/virat1.jpg'
},
{
    "name": "Fan Clubs",
    "des" : "Join Fan Club of your favorite celebrity. Be an official fan!",
    "subdesc" : "Connect with your celebrity and other fans, write comments, view Photos, and do a lot more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/virat2.jpg'
},
{
    "name": "Fan Magazine",
    "des" : "Never miss an issue of your favorite celebrity magazine. Subscribe Now!",
    "subdesc" : "Breaking news, gossips, style tips, fashion, interviews and much more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/virat3.jpg'
}
];
var aamirObj =  [
  {
    "name": "Quizzes",
    "des" : "How well do you know about your celebrities?",
    "subdesc" : "Find out by taking this quiz!",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/amir1.jpg'
},
{
    "name": "Fan Clubs",
    "des" : "Join Fan Club of your favorite celebrity. Be an official fan!",
    "subdesc" : "Connect with your celebrity and other fans, write comments, view Photos, and do a lot more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/amir2.jpg'
},
{
    "name": "Fan Magazine",
    "des" : "Never miss an issue of your favorite celebrity magazine. Subscribe Now!",
    "subdesc" : "Breaking news, gossips, style tips, fashion, interviews and much more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/amir3.jpg'
}
];
var shahrukhObj =  [
  {
    "name": "Quizzes",
    "des" : "How well do you know about your celebrities?",
    "subdesc" : "Find out by taking this quiz!",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sharuk1.jpg'
},
{
    "name": "Fan Clubs",
    "des" : "Join Fan Club of your favorite celebrity. Be an official fan!",
    "subdesc" : "Connect with your celebrity and other fans, write comments, view Photos, and do a lot more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sharuk2.jpg'
},
{
    "name": "Fan Magazine",
    "des" : "Never miss an issue of your favorite celebrity magazine. Subscribe Now!",
    "subdesc" : "Breaking news, gossips, style tips, fashion, interviews and much more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sharuk3.jpg'
}
];
var sachinObj =  [
{
    "name": "Quizzes",
    "des" : "How well do you know about your celebrities?",
    "subdesc" : "Find out by taking this quiz!",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sachin1.jpg'
},
{
    "name": "Fan Clubs",
    "des" : "Join Fan Club of your favorite celebrity. Be an official fan!",
    "subdesc" : "Connect with your celebrity and other fans, write comments, view Photos, and do a lot more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sachin2.jpg'
},
{
    "name": "Fan Magazine",
    "des" : "Never miss an issue of your favorite celebrity magazine. Subscribe Now!",
    "subdesc" : "Breaking news, gossips, style tips, fashion, interviews and much more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/sachin3.jpg'
}
];
var pavanObj =  [
  {
    "name": "Quizzes",
    "des" : "How well do you know about your celebrities?",
    "subdesc" : "Find out by taking this quiz!",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/pk1.jpg'
},
{
    "name": "Fan Clubs",
    "des" : "Join Fan Club of your favorite celebrity. Be an official fan!",
    "subdesc" : "Connect with your celebrity and other fans, write comments, view Photos, and do a lot more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/pk2.jpg'
},
{
    "name": "Fan Magazine",
    "des" : "Never miss an issue of your favorite celebrity magazine. Subscribe Now!",
    "subdesc" : "Breaking news, gossips, style tips, fashion, interviews and much more..",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/pk3.jpg'
}
];

var quickMenu = [
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
  }
  // ,
  // {
  //   "content_type":"text",
  //   "title":"Movies",
  //   "payload":"Movies"
  // },
  // {
  //   "content_type":"text",
  //   "title":"Sports",
  //   "payload":"Sports"
  // },
  // {
  //   "content_type":"text",
  //   "title":"Celebrities",
  //   "payload":"Celebrities"
  // }
  // ,
  // {
  //   "content_type":"text",
  //   "title":"What can you do?",
  //   "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
  // }
];
//app.use(bodyParser.json());
//console.log("------:thread:-----");

const sendContentPacks = (categoryName,event) => {
  console.log("*************---categoryName----*******", categoryName );
    if (categoryName == "Categories") {
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj);
      if (moviesObj.length){
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj.length);
        var senderID = event.sender.id;
        var contentList = [];
        for (var i = 0; i < moviesObj.length; i++) { //Construct request body
            // var keyMap = {
            //     "title":moviesObj[i].name,
            //     //"subtitle":"We\'ve got the right hat for everyone.",
            //     "image_url": moviesObj[i].imgurl,
            //     "item_url": moviesObj[i].imgurl
            //     // "buttons": [{
            //     //     "type": "postback",
            //     //     "title": moviesObj[i].name,
            //     //     "payload": moviesObj[i].name
            //     // }
            //     // {
            //     //     "type": "postback",
            //     //     "title": moviesObj[i].qus,
            //     //     "payload": "USER_DEFINED_PAYLOAD"
            //     // }
            //   //]
            // };
            var keyMap = {
                          "title": moviesObj[i].name,
                          "image_url": moviesObj[i].imgurl,
                                    //"item_url": moviesObj[i].imgurl,
                          "buttons": [{
                                      "type": "postback",
                                      "title": moviesObj[i].name,
                                      "payload": moviesObj[i].name
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
                    //"text":"We have some cool stuff waiting for you..",
                    "payload": {
                        "template_type": "generic",
                        "elements": contentList
                    }
                },
                //"quick_replies": quickMenu
            }
              // "message":{
              //     "text":"Here is some cool and interesting stuff on movies",
              //     "quick_replies":[
              //       {
              //         "content_type":"text",
              //         "title":"Quizzes",
              //         "payload":"Quizzes"
              //       },
              //       {
              //         "content_type":"text",
              //         "title":"Fan Clubs",
              //         "payload":"Fan Clubs"
              //       },
              //       {
              //         "content_type":"text",
              //         "title":"Gossip Corner",
              //         "payload":"Gossip Corner"
              //       },
              //       {
              //         "content_type":"text",
              //         "title":"Fan Magazine",
              //         "payload":"Fan Magazine"
              //       },
              //       {
              //         "content_type":"text",
              //         "title":"What can you do?",
              //         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
              //       }
              //
              //     ]
              //   }
        }
      }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
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
                        "item_url": rows[i].imageurl,
                        //"subtitle":"We\'ve got the right hat for everyone."
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
    } else if (categoryName == "pavan kalyan" || categoryName == "Pavan Kalyan") {
      pavandetails(event);
    }else if (categoryName =="Sachin Tendulkar" || categoryName =="sachin tendulkar") {
      sachindetails(event);
    }else if (categoryName =="Shahrukh Khan" || categoryName =="shahrukh khan" ) {
      shahrukhdetails(event);
    }else if (categoryName =="Aamir Khan" || categoryName =="aamir khan") {
      aamirdetails(event);
    }else if (categoryName =="Virat Kohli" || categoryName =="virat kohli") {
      viratdetails(event);
    }else if (categoryName == "Movies") {
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj);
      if (moviesObj.length){
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj.length);
        var senderID = event.sender.id;
        var contentList = [];
        for (var i = 0; i < moviesObj.length; i++) { //Construct request body
            var keyMap = {
                "title":"We have some cool stuff waiting for you..",
                //"subtitle":"We\'ve got the right hat for everyone.",
                "image_url": moviesObj[i].imgurl,
                "item_url": moviesObj[i].imgurl,
                "buttons": [{
                    "type": "postback",
                    "title": moviesObj[i].name,
                    "payload": "USER_DEFINED_PAYLOAD"
                }
                // {
                //     "type": "postback",
                //     "title": moviesObj[i].qus,
                //     "payload": "USER_DEFINED_PAYLOAD"
                // }
              ]
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
            //         //"text":"We have some cool stuff waiting for you..",
            //         "payload": {
            //             "template_type": "generic",
            //             "elements": contentList
            //         }
            //     },
            //     "quick_replies": quickMenu
            // }
              "message":{
                  "text":"Here is some cool and interesting stuff on movies.\n\nWhy not check them??",
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
                      "title":"Categories",
                      "payload":"Categories"
                    },
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
    }else if (categoryName == "Music") {
      if (categoryName == "Music"){
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":"Here is some cool and interesting stuff on music",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Quizzes",
                    "payload":"Quizzes"
                  },
                  {
                    "content_type":"text",
                    "title":"Music-1",
                    "payload":"Music"
                  },
                  {
                    "content_type":"text",
                    "title":"Music-2",
                    "payload":"Music"
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
    } else if (categoryName == "Celebrities") {
      if (categoryName == "Celebrities"){
        if (celbritieObj.length){
          console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",celbritieObj.length);
          var senderID = event.sender.id;
          var contentList = [];
          for (var i = 0; i < celbritieObj.length; i++) { //Construct request body
              var keyMap = {
                            "title": celbritieObj[i].name,
                            "image_url": celbritieObj[i].imgurl,
                                      //"item_url": moviesObj[i].imgurl,
                            "buttons": [{
                                        "type": "postback",
                                        "title": celbritieObj[i].name,
                                        "payload": celbritieObj[i].name
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
                      //"text":"We have some cool stuff waiting for you..",
                      "payload": {
                          "template_type": "generic",
                          "elements": contentList
                      }
                  },
                  "quick_replies": quickMenu
              }
                // "message":{
                //     "text":"Here is some cool and interesting stuff on movies",
                //     "quick_replies":[
                //       {
                //         "content_type":"text",
                //         "title":"Quizzes",
                //         "payload":"Quizzes"
                //       },
                //       {
                //         "content_type":"text",
                //         "title":"Fan Clubs",
                //         "payload":"Fan Clubs"
                //       },
                //       {
                //         "content_type":"text",
                //         "title":"Gossip Corner",
                //         "payload":"Gossip Corner"
                //       },
                //       {
                //         "content_type":"text",
                //         "title":"Fan Magazine",
                //         "payload":"Fan Magazine"
                //       },
                //       {
                //         "content_type":"text",
                //         "title":"What can you do?",
                //         "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
                //       }
                //
                //     ]
                //   }
          }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
        }else {
            console.log("No Data Found From Database");
            sendHelpMessage(event);
        }
    }else {
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


function pavandetails(event){
  {
    //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj);
    if (pavanObj.length){
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",pavanObj.length);
      var senderID = event.sender.id;
      var contentList = [];
      for (var i = 0; i < pavanObj.length; i++) { //Construct request body
          var keyMap = {
              "title":pavanObj[i].des,
              "subtitle":pavanObj[i].subdesc,
              "image_url": pavanObj[i].imgurl,
              //"item_url": pavanObj[i].imgurl,
              "buttons": [{
                  "type": "postback",
                  "title": pavanObj[i].name,
                  "payload": "USER_DEFINED_PAYLOAD"
              }
              // {
              //     "type": "postback",
              //     "title": moviesObj[i].qus,
              //     "payload": "USER_DEFINED_PAYLOAD"
              // }
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
                  //"text":"We have some cool stuff waiting for you..",
                  "payload": {
                      "template_type": "generic",
                      "elements": contentList
                  }
              },
              "quick_replies": quickMenu
          }
      }
      callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
  }else {
      console.log("No Data Found From Database");
      sendHelpMessage(event);
  }
  }
}

function sachindetails(event){
  {
    if (sachinObj.length){
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",sachinObj.length);
      var senderID = event.sender.id;
      var contentList = [];
      for (var i = 0; i < sachinObj.length; i++) { //Construct request body
          var keyMap = {
              "title":sachinObj[i].des,
              "subtitle":sachinObj[i].subdesc,
              "image_url": sachinObj[i].imgurl,
              //"item_url": sachinObj[i].imgurl,
              "buttons": [{
                  "type": "postback",
                  "title": sachinObj[i].name,
                  "payload": "USER_DEFINED_PAYLOAD"
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
                  //"text":"We have some cool stuff waiting for you..",
                  "payload": {
                      "template_type": "generic",
                      "elements": contentList
                  }
              },
              "quick_replies": quickMenu
          }

      }
      callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
  }else {
      console.log("No Data Found From Database");
      sendHelpMessage(event);
  }
  }
}
function shahrukhdetails(event){
  {
    if (shahrukhObj.length){
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",shahrukhObj.length);
      var senderID = event.sender.id;
      var contentList = [];
      for (var i = 0; i < shahrukhObj.length; i++) { //Construct request body
          var keyMap = {
              "title":shahrukhObj[i].des,
              "subtitle":shahrukhObj[i].subdesc,
              "image_url": shahrukhObj[i].imgurl,
              //"item_url": shahrukhObj[i].imgurl,
              "buttons": [{
                  "type": "postback",
                  "title": shahrukhObj[i].name,
                  "payload": "USER_DEFINED_PAYLOAD"
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
                  //"text":"We have some cool stuff waiting for you..",
                  "payload": {
                      "template_type": "generic",
                      "elements": contentList
                  }
              },
              "quick_replies": quickMenu
          }

      }
      callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
  }else {
      console.log("No Data Found From Database");
      sendHelpMessage(event);
  }
  }
}
function aamirdetails(event){
  {
    if (aamirObj.length){
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",aamirObj.length);
      var senderID = event.sender.id;
      var contentList = [];
      for (var i = 0; i < aamirObj.length; i++) { //Construct request body
          var keyMap = {
              "title":aamirObj[i].des,
              "subtitle":aamirObj[i].subdesc,
              "image_url": aamirObj[i].imgurl,
            //  "item_url": aamirObj[i].imgurl,
              "buttons": [{
                  "type": "postback",
                  "title": aamirObj[i].name,
                  "payload": "USER_DEFINED_PAYLOAD"
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
                  //"text":"We have some cool stuff waiting for you..",
                  "payload": {
                      "template_type": "generic",
                      "elements": contentList
                  }
              },
              "quick_replies": quickMenu
          }

      }
      callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
  }else {
      console.log("No Data Found From Database");
      sendHelpMessage(event);
  }
  }
}

function viratdetails(event){
  {
    if (viratObj.length){
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",viratObj.length);
      var senderID = event.sender.id;
      var contentList = [];
      for (var i = 0; i < viratObj.length; i++) { //Construct request body
          var keyMap = {
              "title":viratObj[i].des,
              "subtitle":viratObj[i].subdesc,
              "image_url": viratObj[i].imgurl,
              //"item_url": viratObj[i].imgurl,
              "buttons": [{
                  "type": "postback",
                  "title": viratObj[i].name,
                  "payload": "USER_DEFINED_PAYLOAD"
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
                  //"text":"We have some cool stuff waiting for you..",
                  "payload": {
                      "template_type": "generic",
                      "elements": contentList
                  }
              },
              "quick_replies": quickMenu
          }

      }
      callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
  }else {
      console.log("No Data Found From Database");
      sendHelpMessage(event);
  }
  }
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
        var msg = 'Hey '+username+', How are you?\n \nDid you check these amazingly cool stuff on Fankick?';
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

function sendHelpMessageSecond(event, userid) {
    var senderID = event.sender.id;
        var msg = 'Did you check these amazingly cool stuff on Fankick?';
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":msg,
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Categories",
                    "payload":"Categories"
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
                    "title":"Music",
                    "payload":"Music"
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
  sendContentPacks: sendContentPacks,
  // name:name,
  quickMenu:quickMenu
};

'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const movies = require('../contentjson/movies.json');
//var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 1,
    host: 'ap-cdbr-azure-southeast-a.cloudapp.net',
    user: 'bb603e8108da6e',
    password: '3e384329',
    database: 'rankworlddev'
});
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';
var quickreply = [
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

var hollywood = [
    {
      "content_type":"text",
      "title":"hollywood movies",
      "payload":"hollywood movies"
    },
    {
      "content_type":"text",
      "title":"hollywood trailer",
      "payload":"hollywood trailer"
    },
    {
      "content_type":"text",
      "title":"hollywood actors",
      "payload":"hollywood actors"
    },
    {
      "content_type":"text",
      "title":"hollywood actress",
      "payload":"hollywood actress"
    },
    {
      "content_type":"text",
      "title":"hollywood actors",
      "payload":"hollywood actors"
    },
    {
      "content_type":"text",
      "title":"Home",
      "payload":"home",
      "image_url":"https://fankickdev.blob.core.windows.net/images/home_logo.png"
    }
];

var moviesObj =  [
  {
    "name": "Movies",
    "imgurl": 'https://fankickdev.blob.core.windows.net/images/movies.jpg'
},
{
    "name": "TV Shows",
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

var quickMenu = [
  {
    "image_url":'https://fankickdev.blob.core.windows.net/images/movies.jpg',
    "content_type":"text",
    "title":'Categories O:-)',
    "payload":"Categories"
  },
  {
    "content_type":"text",
    "title":'Fan Clubs :-)',
    "payload":"Fan Clubs",
    "image_url":'https://fankickdev.blob.core.windows.net/images/sports.jpg'
  },
  {
    "content_type":"text",
    "title":'Fan Magazine O:-)',
    "payload":"Fan Magazine",
    "image_url":'https://fankickdev.blob.core.windows.net/images/celebrities.jpg'
  }
];
// var quickMenu = [
//       {
//         "content_type":"location",
//       }
//     ];
//app.use(bodyParser.json());
//console.log("------:thread:-----");

const sendContentPacks = (categoryName,event) => {
  console.log("*************---categoryName----*******", categoryName );
    if (categoryName == "get started") {
        //greetingtext(messagingEvent,Get Started);
        var senderID = event.sender.id;
        thread.persistentMenu(fbpage_access_token);
        fbuserdetails(event, senderID);
        //sendTextMessage(userid, 'Get Started');
        console.log("categoryName", categoryName);
        //getStarted();
    }else if (categoryName == "fan clubs") {
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM fk_pack_fanclub', function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];

                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].img_url,
                        //"item_url": rows[i].imageurl,
                        // "buttons": [{
                        //     "type": "web_url",
                        //     "url": rows[i].name,
                        //     "title": rows[i].name
                        // }]
                        "buttons": [{
                            "type": "postback",
                            "title": rows[i].name,
                            "payload": rows[i].name
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
    } else if (categoryName == "fan magazine") {
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
                        //"item_url": rows[i].imageurl,
                        //"subtitle":"We\'ve got the right hat for everyone."
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
    } else if (categoryName == "pavan kalyan" || categoryName == "nagarjuna" || categoryName == "chiranjeevi" || categoryName == "allu arjun"|| categoryName == "bala krishna") {
      //celebritiesdetails(categoryName,event);
      googlegraph(categoryName,event);

    }else if (categoryName == "hollywood" || categoryName == "tollywood" || categoryName == "bollywood" || categoryName == "kollywood" || categoryName == "classical music" || categoryName == "western music") {
      //celebritiesdetails(categoryName,event);
      googlegraph(categoryName,event);
      usersubcategory(event, categoryName);
    }else if (categoryName == "cricket" || categoryName == "soccer" || categoryName == "football" || categoryName == "tennis" || categoryName == "badminton") {
      //celebritiesdetails(categoryName,event);
      googlegraph(categoryName,event);
      usersubcategory(event, categoryName);
    }
      else if (categoryName =="akshay kumar" || categoryName =="shahrukh khan" || categoryName =="aamir khan" || categoryName =="ranveer singh" || categoryName =="hrithik roshan" || categoryName =="hindi films" || categoryName =="telugu films" || categoryName =="bollywood films") {
          //googletrendsfun(categoryName,event);
          googlegraph(categoryName,event);
    }
    else if (categoryName =="virat kohli" || categoryName =="rohit sharma" || categoryName =="rohit sharma records" || categoryName =="yuvraj singh" || categoryName =="sachin tendulkar" || categoryName =="dhoni" || categoryName =="sakshi dhoni" ) {
          //googletrendsfun(categoryName,event);
          googlegraph(categoryName,event);
          //googletrendsfun(categoryName,event);
      }
    else if (categoryName =="videos" || categoryName =="audio"|| categoryName =="movies" || categoryName =="sports" || categoryName =="tv shows"|| categoryName =="music"  || categoryName =="home" ) {
      //allcategory(event, categoryName);
      usercategory(event, categoryName);
      userlocation(event, categoryName);
      console.log("enter into the allcategory function");
    }
    else {
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM fk_content_pack where category_id = (SELECT id FROM fk_category where name = ?)', [categoryName], function(err, rows) {
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                var datalength = rows.length;
                if(datalength>10){
                for (var i = 0; i < 5; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].image_url,
                        //"item_url": rows[i].image_url,
                        "subtitle": categoryName,
                        "buttons": [{
                            "type": "postback",
                            "title": "View",
                            "payload": rows[i].id
                        }
                      //   // , {
                      //   //     "type": "postback",
                      //   //     "title": "Magazine",
                      //   //     "payload": "USER_DEFINED_PAYLOAD"
                      //   // }
                      ]
                    };
                    contentList.push(keyMap);
                }
              }else{
                for (var i = 0; i < datalength; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].image_url,
                        //"item_url": rows[i].image_url,
                        "subtitle": categoryName,
                        "buttons": [{
                            "type": "postback",
                            "title": "View",
                            "payload": rows[i].id
                        }
                      //   // , {
                      //   //     "type": "postback",
                      //   //     "title": "Magazine",
                      //   //     "payload": "USER_DEFINED_PAYLOAD"
                      //   // }
                      ]
                    };
                    contentList.push(keyMap);
                }
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

function allcategory(event, categoryName){
  var senderID = event.sender.id;
  var imgdangol = 'http://t3.gstatic.com/images?q=tbn:ANd9GcQIXnFlBKGWT1ByyIu3qfxX6opQX6BmeeU_qsiE3X8rX9ZRr63r';
   try {
      categoryName = "../contentjson/" + categoryName;
      var json  = require(categoryName);
      var fullMessage = { recipient: { id: senderID }};
      fullMessage.message = json;
      callSendAPI(fullMessage,'https://graph.facebook.com/v2.6/592208327626213/messages');
   }
   catch (e)
   {
      console.log("error in sendSingleJsonMessage " + e.message + " " + categoryName + " " + fullMessage);
   }
}



function googletrendsfun(categoryName,event){
  var senderID = event.sender.id;
  googleTrends.risingSearches(categoryName,'IN')
    .then(function(results){
      console.log("Google trendz",results);
      var googleTrends_result = results;
        for(var i in googleTrends_result){
          console.log(i.value); // alerts key
          console.log(googleTrends_result[i]); //alerts key's value
          var googleTrends_result_obj = googleTrends_result[i]
        }
        var aaa=JSON.stringify(googleTrends_result_obj);
        var googleTrends_result_obj_name = [];
        Object.keys(googleTrends_result_obj).forEach(function(key) {
            console.log(key + ':----- ' + googleTrends_result_obj[key]);
            var myArray = key;
            console.log(myArray + ':----- ' + googleTrends_result_obj[key]);
            googleTrends_result_obj_name.push(myArray);
        });
        console.log("**************************",googleTrends_result_obj_name);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":categoryName,
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":googleTrends_result_obj_name[4],
                    "payload":googleTrends_result_obj_name[4]
                  },
                  {
                    "content_type":"text",
                    "title":googleTrends_result_obj_name[5],
                    "payload":googleTrends_result_obj_name[5]
                  },
                  {
                    "content_type":"text",
                    "title":googleTrends_result_obj_name[6],
                    "payload":googleTrends_result_obj_name[6]
                  },
                  {
                    "content_type":"text",
                    "title":googleTrends_result_obj_name[7],
                    "payload":googleTrends_result_obj_name[7]
                  },
                  {
                    "content_type":"text",
                    "title":googleTrends_result_obj_name[8],
                    "payload":googleTrends_result_obj_name[8]
                  },
                  {
                    "content_type":"text",
                    "title":"Home",
                    "payload":"Categories",
                    "image_url":"https://fankickdev.blob.core.windows.net/images/home_logo.png"
                  }
                ]
              }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');

    })
    .catch(function(err){
      console.error(err);
      sendHelpMessage(event);
    });

    googleTrends.hotTrends('IN')
    .then(function(results){
      console.log("googleTrends.hotTrends results",results);
    })
    .catch(function(err){
        console.log("googleTrends.hotTrends err", err);
      });
}

function quizzes(event){
  var senderID = event.sender.id;
  // if(categoryName == "Content Pack 1"){
  //   categoryName = 1;
  // } else if (categoryName == "Content Pack 2"){
  //   categoryName = 2;
  // } else (categoryName == "Content Pack 3"){
  //   categoryName = 3;
  // }

  pool.getConnection(function(err, connection) {
  //connection.query('SELECT * FROM fk_pack_multiple_item where type=? and pack_id in (select id from fk_content_pack where category_id=?)', ['Question',categoryName], function(err, rows) {
  connection.query('SELECT * FROM fk_pack_multiple_item where pack_id=(select id from fk_content_pack where name="Aamir Khan")and type=?', ['Question'], function(err, rows) {

      //console.log("*************************-after", categoryName);
      console.log("*************************Questions Packs********************", rows);
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
                  "text":rows[2].item_name,
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":rows[2].text1_content,
                      "payload":"1"
                    },
                    {
                      "content_type":"text",
                      "title":rows[2].text2_content,
                      "payload":"2"
                    },
                    {
                      "content_type":"text",
                      "title":rows[2].text3_content,
                      "payload":"3"
                    },
                    {
                      "content_type":"text",
                      "title":rows[2].text4_content,
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

function review(event){
  var senderID = event.sender.id;
  var imgdangol = 'http://t3.gstatic.com/images?q=tbn:ANd9GcQIXnFlBKGWT1ByyIu3qfxX6opQX6BmeeU_qsiE3X8rX9ZRr63r';
  var contentList = [];
  var keyMap = {
            "title": "Review",
            "image_url": imgdangol,
            "subtitle":"That was crucial for us to believe in Dangal, which borrows several elements from the real-life Haryana wrestler who trained his older two daughters, Geeta (Fatima Sana Shaikh) and Babita (Sanya Malhotra), in the art of wrestling, and turned them into winners. Dangal works on the twin parameters it sets up for itself.",
            "buttons": [{
              "type": "web_url",
               "url": 'http://timesofindia.indiatimes.com/entertainment/hindi/movie-reviews/dangal/movie-review/56102623.cms',
               "title": "Read More"
            },{
              "type":"element_share"
            }
            // ,{
            //   "type": "web_url",
            //    "url": trailer,
            //    "title": "Trailer"
            // }
          //   // , {
          //   //     "type": "postback",
          //   //     "title": "Magazine",
          //   //     "payload": "USER_DEFINED_PAYLOAD"
          //   // }
          ]
        };
        contentList.push(keyMap);
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
        }


function celebritiesdetails(categoryName,event){
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * fk_pack_fanclub where name=?',[categoryName], function(err, rows) {
        if (err) {
            console.log("Error While retriving content pack data from database:", err);
        } else if (rows.length) {
            var senderID = event.sender.id;
            var contentList = [];

            for (var i = 0; i < rows.length; i++) { //Construct request body
                var keyMap = {
                    "title": rows[i].name,
                    "image_url": rows[i].image_url,
                  //  "item_url": rows[i].image_url,
                    "buttons": [{
                        "type": "postback",
                        "title": "View",
                        "payload": rows[i].id
                    }
                  //   // , {
                  //   //     "type": "postback",
                  //   //     "title": "Magazine",
                  //   //     "payload": "USER_DEFINED_PAYLOAD"
                  //   // }
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
// ************************** Googlegraph api ********************************
function googlegraph(categoryName,event){
  console.log("*************---categoryName----*******", categoryName );
  var contentList = [];
  var quickList = [];

  var userid = event.sender.id;
var url = 'https://kgsearch.googleapis.com/v1/entities:search?query=' + categoryName + '&key=AIzaSyCavmWhCL_wMeLAKrurcVPUdP0ztgubHZc&limit=5&indent=True'

    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'
    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        console.log("--------:Response data:--------first_name ", userprofiledata.itemListElement);
        var rows = userprofiledata.itemListElement;
        var rowlen = rows.length;
        console.log("--------:Response data:--------length ", rowlen);
        var senderID = event.sender.id;
          var imagedata;
          var desdata;
        for (var i = 0; i < 3; i++) { //Construct request body
          // console.log("--------:google Response data:-------- name ", rows[i].result.name);
          // var name1 = rows[0].result.name;
          // var name2 = rows[1].result.name;
          // var name3 = rows[2].result.name;
          // var name4 = rows[3].result.name;
          // var name5 = rows[4].result.name;
          // //var namesfromgoogle = rows[0].result.name;
          // imagedata = rows[0].result.image;
          // console.log("%%%%%%%%%%%%%%%%%%%%%",imagedata);
          // desdata = rows[0].result.detailedDescription;
          // console.log("%%%%%%%%%%%%%%%%%%%%%",desdata);
          // //contentList.push(namesfromgoogle);
//-----------------------------------------------------------
var keyMap = {
                     "title": rows[i].result.name,
         "image_url":rows[i].result.image.url,
         "subtitle":rows[i].result.detailedDescription.articleBody,
                     "buttons": [{
                         "type": "postback",
                         "title": rows[i].result.image.contentUrl,
                         "payload": "Read More"
                     }
                   ]
                 };
                 contentList.push(keyMap);

       var quickMap = {
                 "content_type":"text",
                 "title":rows[i].result.name,
                 "payload":rows[i].result.name
       };

                 quickList.push(quickMap);
//--------------------------------------------------------




        }
        var desdetails = desdata.articleBody;
        console.log("%%%%%%%%%%%%%%%%%%%%%desdetails",desdetails);
        var conurl = imagedata.contentUrl;
          console.log("%%%%%%%%%%%%%%%%%%%%%conurl",conurl);
        var desurl = imagedata.url;
          console.log("%%%%%%%%%%%%%%%%%%%%%desurl",desurl);

          var messageData = { recipient: { id: senderID }};
//           messageData.message = {
//       "attachment": {
//         "type": "template",
//           "payload": {
//             "template_type": "generic",
//             "elements":[{
//                 "title":name1,
//                 "image_url":conurl,
//                 "subtitle":desdetails,
//                 "buttons":[{
//                   "type":"web_url",
//                   "url":desurl,
//                   "title":"Read More"
//                 }]
//               }]
//           }
//         },
//         //"quick_replies": categoryName
//       "quick_replies":[
//                   {
//                     "content_type":"text",
//                     "title":name1.slice(0,20),
//                     "payload":rows[0].result.name
//                   },
//                   {
//                     "content_type":"text",
//                     "title":name2.slice(0,20),
//                     "payload":rows[1].result.name
//                   },
//                   {
//                     "content_type":"text",
//                     "title":name3.slice(0,20),
//                     "payload":rows[2].result.name
//                   },
//                   {
//                     "content_type":"text",
//                     "title":name4.slice(0,20),
//                     "payload":rows[3].result.name
//                   },
//                   {
//                     "content_type":"text",
//                     "title":name5.slice(0,20),
//                     "payload":rows[4].result.name
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Google",
//                     "payload":"google",
//                     "image_url":"https://fankickdev.blob.core.windows.net/images/google.png"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Youtube",
//                     "payload":"Youtube",
//                     "image_url":"https://fankickdev.blob.core.windows.net/images/youtube.png"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Facebook",
//                     "payload":"Facebook",
//                     "image_url":"https://fankickdev.blob.core.windows.net/images/fb.jpg"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Twitter",
//                     "payload":"Twitter",
//                     "image_url":"https://fankickdev.blob.core.windows.net/images/twitter.png"
//                   },
//                   {
//                     "content_type":"text",
//                     "title":"Home",
//                     "payload":"Categories",
//                     "image_url":"https://fankickdev.blob.core.windows.net/images/home_logo.png"
//                   }]
//
//
// }

//---------------------------------------------------------------
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
                          "quick_replies": quickList
                    }
                }
//--------------------------------------------------------------
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    });
}


function sendHelpMessage(event){
  //fbuserlocation();
    var userid = event.sender.id;
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        var username = userprofiledata.first_name;
        console.log("--------:Response data:-------- ", JSON.stringify(body));
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
                "quick_replies":quickreply
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
                "quick_replies":quickreply
              }
            }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
}

// const fbuserdetails = (event,userid) =>{
function fbuserdetails(event, userid) {
    var url = 'https://graph.facebook.com/v2.6/' + userid + '?fields=first_name,last_name,locale,timezone,gender&access_token=' + fbpage_access_token + '';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userfbdata = JSON.parse(response.body);
        var userfname = userfbdata.first_name;
        var userlname = userfbdata.last_name;
        //var userFullName = userfname + userlname;
        var userFullName = userfname.concat(userlname);
        console.log(userFullName,"This is suser ");
        //console.log("--------:Response data:-------- ", JSON.stringify(body));
        console.log("--------:Response data:--------first_name ", userfbdata.first_name);
        console.log("--------:Response data:--------last_name ", userfbdata.last_name);
        console.log("--------:Response data:--------locale ", userfbdata.locale);
        console.log("--------:Response data:-------- timezone", userfbdata.timezone);
        console.log("--------:Response data:--------gender ", userfbdata.gender);
        //console.log("--------:Response data:--------age_range ", userfbdata.age_range);
        var senderID = event.sender.id;
        // pool.getConnection(function(err, connection) {
        //   connection.query('SELECT * fk_pack_fanclub where name=?',[categoryName], function(err, rows) {
        //       if (err) {
        //           console.log("Error While retriving content pack data from database:", err);
        //       } else {
        //           console.log("No Data Found From Database");
        //           sendHelpMessage(event);
        //           //sendImageMessage(event);
        //       }
        //       connection.release();
        //   });
        //   });
        //
          pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO cc_user_preference(facebookId, firstName, lastName, fullName, gender, locale, timeZone)VALUES(?,?,?,?,?,?,?)',[senderID, userfname, userlname, userFullName, userfbdata.gender, userfbdata.locale,userfbdata.timezone], function(err, rows) {
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
        //
        //     pool.getConnection(function(err, connection) {
        //       connection.query('update cc_user_preference set language="Telugu" where facebookId=?',[senderID], function(err, rows) {
        //           if (err) {
        //               console.log("Error While retriving content pack data from database:", err);
        //           } else {
        //               console.log("No Data Found From Database");
        //               //sendHelpMessage(event);
        //               //sendImageMessage(event);
        //           }
        //           connection.release();
        //       });
        //       });

        //fbuserlocation();
        //var msg = 'Hi '+username+', A lot of exciting things are awaiting for you! Get kicking!';
        //var msg = 'Hi '+username+'! My name is Kicker.\n How may I come of any help to you today?';
    //var msg = 'Hi '+username+'! My name is Kicker.\n \nI can help you get closer to your favorite celebrity with a lot of exciting things about them.\n\n Choose what excites you more';
  var msg = 'Welcome to the club! \n \nEntertainment is served here, order your preferences…';
        console.log("--------:Response data:--------msg1 ", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":msg,
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Movies",
                    "payload":"Movies"
                  },
                  {
                    "content_type":"text",
                    "title":"Music",
                    "payload":"Music"
                  },
                  {
                    "content_type":"text",
                    "title":"TV Shows",
                    "payload":"TV Shows"
                  },
                  {
                    "content_type":"text",
                    "title":"Sports",
                    "payload":"Sports"
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
         //test(senderID);
         //fbuserdetailsSecond(event, userid);
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


function usercategory(event, categoryName){
  var senderID = event.sender.id;
  pool.getConnection(function(err, connection) {
    connection.query('update cc_user_preference set category = ? where facebookId = ?',[categoryName,senderID], function(err, rows) {
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


function userlocation(event, categoryName){
  var senderID = event.sender.id;
  var userloca;
  pool.getConnection(function(err, connection) {
    connection.query('select location from cc_user_preference where facebookId = ?',[senderID], function(err, rows) {
        if (err) {
            console.log("Error While retriving content pack data from database:", err);
        } else {
            console.log("***********No Data Found From Database*********",rows[0].location);
            userloca = rows[0].location;
            console.log("***********No Data Found From Database*********userloca",userloca);
            //sendHelpMessage(event);
            //sendImageMessage(event);
        }
        connection.release();
        console.log("*******************User location NULL****************", userloca);
        //usercategory(event, categoryName)
        adduserlocation(event,userloca,categoryName);
    });
    });




}


    function usersubcategory(event, categoryName){
      var senderID = event.sender.id;
      pool.getConnection(function(err, connection) {
        connection.query('update cc_user_preference set subcategory = ? where facebookId = ?',[categoryName,senderID], function(err, rows) {
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


function adduserlocation(event,userloca,categoryName){
  console.log("*********************adduserlocation***********************1",userloca);
  if(userloca == null){
    var senderID = event.sender.id;
  console.log("*********************adduserlocation***********************2",senderID);
   var msg = 'Let us know your location, we wanna offer you the best and the most relevant!';
         console.log("--------:Response data:--------msg1 ", msg);
         var messageData = {
             "recipient": {
                 "id": senderID
             },
             "message":{
                 "text":msg,
                 "quick_replies":[
                   {
                      "content_type":"location"
                   },
                   {
                     "content_type":"text",
                     "title":"skip",
                     "payload":"home",
                     "image_url":"https://fankickdev.blob.core.windows.net/images/home_logo.png"
                   }
                 ]

               }
             }
          callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
        }else{
          console.log("*********************adduserlocation***********************3",userloca);
          allcategory(event, categoryName);
        }

}





function findlocation(event){
  console.log("findlocation");
  var senderID = event.sender.id;
  pool.getConnection(function(err, connection) {
    connection.query('SELECT language from cc_user_preference where facebookId=?',[senderID], function(err, rows) {
      console.log("Result for language",rows);
      console.log("Result for language",rows[0].language);

        if (err) {
            console.log("Error While retriving content pack data from database:", err);
        } else {
            console.log("No Data Found From Database");
          //  sendHelpMessage(event);
            //sendImageMessage(event);
        }
        connection.release();
    });
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

function fbuserlocation() {
    //var url = 'https://geoip-db.com/json/';
      var url = 'http://ipinfo.io';
    console.log("url", url);
    request({
        "uri": url,
        "method": 'GET'

    }, function(error, response, body) {
        var userprofiledata = JSON.parse(response.body);
        console.log("Successfully find the location", userprofiledata);

            });
          }

module.exports = {
  sendContentPacks: sendContentPacks,
  //fbuserdetails:fbuserdetails,
  // name:name,
  quickMenu:quickMenu
};

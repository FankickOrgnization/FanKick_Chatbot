'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const movies = require('./contentjson/movies.json');
//var app = express();
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 1,
    host: 'ap-cdbr-azure-southeast-a.cloudapp.net',
    user: 'bb603e8108da6e',
    password: '3e384329',
    database: 'rankworlddev'
});
var fbpage_access_token = 'EAAXcJew5yNkBAAvFD3wX3RZACdvA4lZB6XStBzliKI9y4m7I1taAnWUWBezVarL8FjteZCztMBjXZCs35lAweqmc2XZARIf378LZA5lTg5xIebmBmFL4MmJGU4JrowfdkkKDbjqwuzBkCWPxQjgddrW4EZBnv6LiccAHdqoLUNcsgZDZD';
var quickreply = [
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
    if (categoryName == "Categories") {
      console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj);
      if (moviesObj.length){
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",moviesObj.length);
        var senderID = event.sender.id;
        var contentList = [];
        for (var i = 0; i < moviesObj.length; i++) { //Construct request body
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
        }
      }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    } else if (categoryName == "Get Started") {
        //greetingtext(messagingEvent,Get Started);
        var senderID = event.sender.id;
        thread.persistentMenu(fbpage_access_token);
        fbuserdetails(event, senderID);
        //sendTextMessage(userid, 'Get Started');
        console.log("categoryName", categoryName);
        //getStarted();
    }else if (categoryName == "Fan Clubs") {
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
    } else if (categoryName == "pavan kalyan" || categoryName == "Pavan Kalyan" || categoryName == "Chiranjeevi" || categoryName == "Kalyan"|| categoryName == "Pawan Kalyan") {
      //celebritiesdetails(categoryName,event);
      googlegraph(categoryName,event);
    }else if (categoryName =="Sachin Tendulkar" || categoryName =="sachin tendulkar" || categoryName =="sachin" || categoryName =="tendulkar") {
      googleTrends.risingSearches('Shahrukh Khan')
        .then(function(results){
          console.log("Google trendz",results);
          var googleTrends_result = results;
            for(var i in googleTrends_result){
              console.log(i.value); // alerts key
              console.log(googleTrends_result[i]); //alerts key's value
              var googleTrends_result_obj = googleTrends_result[i]
            }
            console.log(googleTrends_result_obj);
          //console.log(Object.keys(googleTrends_result));
          // for ( property in googleTrends_result ) {
          //   console.log( property ); // Outputs: foo, fiz or fiz, foo
          // }
          //console.log("googleTrends_result",googleTrends_result);
        })
        .catch(function(err){
          console.error(err);
        });
    }else if (categoryName =="Shahrukh Khan" || categoryName =="shahrukh khan" || categoryName =="shahrukh" ) {
          googletrendsfun(categoryName,event);
    }else if (categoryName =="Aamir Khan" || categoryName =="aamir khan" || categoryName =="aamir" || categoryName == "dangal" || categoryName == "Dangal") {
      //celebritiesdetails(categoryName,event);
    //  googlegraph(categoryName,event);
    googletrendsfun(categoryName,event);
    }else if (categoryName =="Virat Kohli" || categoryName =="virat kohli" || categoryName =="kohli" || categoryName =="virat") {
      //celebritiesdetails(categoryName,event);
       googlegraph(categoryName,event);
    }else if (categoryName =="dangal review") {
      review(event);
    }else if (categoryName =="Aamir Quizzes") {
      quizzes(event);
    }else if (categoryName =="Aamir Fan Clubs") {
      fanClubs(event);
    }else if (categoryName =="Aamir Fan Magazine") {
      fanMagazine(event);
    }else if (categoryName =="movies" || categoryName =="sports" || categoryName =="tv shows"|| categoryName =="music") {
      allcategory(event, categoryName);
    }
    else if (categoryName == "Movies") {
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
              ]
            };
            contentList.push(keyMap);
        }
        var messageData = {
            "recipient": {
                "id": senderID
            },
              "message":{
                  "text":"Movie is the king of entertainment. Pick your favorite kingdom (You can select multiple)… :-)",
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Hollywood",
                      "payload":"Hollywood"
                    },
                    {
                      "content_type":"text",
                      "title":"Bollywood",
                      "payload":"Bollywood"
                    },
                    {
                      "content_type":"text",
                      "title":"Tollywood",
                      "payload":"Tollywood"
                    },
                    {
                      "content_type":"text",
                      "title":"Kollywood",
                      "payload":"Kollywood"
                    },
                    {
                      "content_type":"text",
                      "title":"Categories",
                      "payload":"Categories"
                    },
                    {
                      "content_type":"location",
                    }
                  ]
                }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    }else {
        console.log("No Data Found From Database");
        sendHelpMessage(event);
    }
    }
    else if (categoryName == "Sports") {
      if (categoryName == "Sports"){
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
  "attachment":{
    "type":"video",
    "payload":{
      "url":"https://www.youtube.com/watch?v=HTIrzHThPvs"
    }
  }
}
            // "message":{
            //     "text":"Let's hit the world! There is no thrill beyond sports, which sport(s) enthrills you more… :-)",
            //     "quick_replies":[
            //       {
            //         "content_type":"text",
            //         "title":"Cricket",
            //         "payload":"Cricket"
            //       },
            //       {
            //         "content_type":"text",
            //         "title":"Soccer",
            //         "payload":"Soccer"
            //       },
            //       {
            //         "content_type":"text",
            //         "title":"Tennis",
            //         "payload":"Tennis"
            //       },
            //       {
            //         "content_type":"text",
            //         "title":"Badminton",
            //         "payload":"Badminton"
            //       },
            //       {
            //         "content_type":"text",
            //         "title":"Categories",
            //         "payload":"Categories"
            //       }
            //     ]
            //   }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    }else {
        console.log("No Data Found From Database");
        sendHelpMessage(event);
    }
    }
    else if (categoryName == "Music") {
      if (categoryName == "Music"){
        var senderID = event.sender.id;
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":
            {
                "text":"Widen your ears! I'm going to make a huge noise, define the tune… :-)",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":"Quizzes",
                    "payload":"Quizzes"
                  },
                  {
                    "content_type":"text",
                    "title":"Classical Music",
                    "payload":"Music"
                  },
                  {
                    "content_type":"text",
                    "title":"Western Music",
                    "payload":"Music"
                  },
                  {
                    "content_type":"text",
                    "title":"Categories",
                    "payload":"Categories"
                  },
                  {
                    "content_type":"location",
                  }

                ]
              }

  //           "message":{
  //   "attachment":{
  //     "type":"audio",
  //     "payload":{
  //       "url":"https://petersapparel.com/bin/clip.mp3"
  //     }
  //   }
  // }
        }
        callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
        }else {
            console.log("No Data Found From Database");
            sendHelpMessage(event);
        }
    }
    else if (categoryName == "TV Shows") {
      if (categoryName == "TV Shows"){

        // if (celbritieObj.length){
        //   console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%",celbritieObj.length);
          var senderID = event.sender.id;
            findlocation(event);
          // var contentList = [];
          // for (var i = 0; i < celbritieObj.length; i++) { //Construct request body
          //     var keyMap = {
          //                   "title": celbritieObj[i].name,
          //                   "image_url": celbritieObj[i].imgurl,
          //                             //"item_url": moviesObj[i].imgurl,
          //                   "buttons": [{
          //                               "type": "postback",
          //                               "title": celbritieObj[i].name,
          //                               "payload": celbritieObj[i].name
          //                             }]
          //                         };
          //
          //     contentList.push(keyMap);
          // }
          var messageData = {
              "recipient": {
                  "id": senderID
              },
              "message": {
                  "text":"My dad won't allow me to switch on the Idiot Box, please switch me up and set the favorite mode…",
                  "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"Romantic Comedy",
                      "payload":"Romantic Comedy"
                    },
                    {
                      "content_type":"text",
                      "title":"Action",
                      "payload":"Action"
                    },
                    {
                      "content_type":"text",
                      "title":"Horror",
                      "payload":"Horror"
                    },
                    {
                      "content_type":"text",
                      "title":"Animation",
                      "payload":"Animation"
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
        }else {
            console.log("No Data Found From Database");
            sendHelpMessage(event);
        }
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
   try {
      filename = "./contentjson/" + filename;
      var json  = require(filename);
      var fullMessage = { recipient: { id: senderID }};
      fullMessage.message = json;
      callSendAPI(fullMessage,'https://graph.facebook.com/v2.6/592208327626213/messages');
   }
   catch (e)
   {
      console.log("error in sendSingleJsonMessage " + e.message + " " + filename + " " + fullMessage);
   }
}



function googletrendsfun(categoryName,event){
  var senderID = event.sender.id;
  googleTrends.risingSearches(categoryName)
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
                    "title":"Categories",
                    "payload":"Categories"
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
//var trailer = 'https://www.youtube.com/watch?v=x_7YlGv9u1g';
  // var keyMap = {
  //     "title": "Review",
  //     "image_url": imgdangol,
  //     "subtitle":"That was crucial for us to believe in Dangal, which borrows several elements from the real-life Haryana wrestler who trained his older two daughters, Geeta (Fatima Sana Shaikh) and Babita (Sanya Malhotra), in the art of wrestling, and turned them into winners. Dangal works on the twin parameters it sets up for itself.",
  //     "buttons": [{
  //         "type": "postback",
  //         "title": "View",
  //         "payload": "View"
  //     }]
  //   };
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

function googlegraph(categoryName,event){
  console.log("*************---categoryName----*******", categoryName );
  var contentList = [];
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
        console.log("--------:Response data:--------first_name ", userprofiledata.itemListElement);
        var rows = userprofiledata.itemListElement;
        var rowlen = rows.length;
        console.log("--------:Response data:--------length ", rowlen);
        var senderID = event.sender.id;
        for (var i = 0; i < 5; i++) { //Construct request body
          console.log("--------:google Response data:-------- name ", rows[i].result.name);
          var name1 = rows[0].result.name;
          var name2 = rows[1].result.name;
          var name3 = rows[2].result.name;
          var name4 = rows[3].result.name;
          var name5 = rows[4].result.name;
          var namesfromgoogle = rows[i].result.name;
          contentList.push(namesfromgoogle);


          // for (var i = 0; i < moviesObj.length; i++) { //Construct request body
          //     var keyMap = {
          //                   "title": moviesObj[i].name,
          //                   "image_url": moviesObj[i].imgurl,
          //                             //"item_url": moviesObj[i].imgurl,
          //                   "buttons": [{
          //                               "type": "postback",
          //                               "title": moviesObj[i].name,
          //                               "payload": moviesObj[i].name
          //                             }]
          //                         };
          //
          //     contentList.push(keyMap);
          // }



          // var keyMpa ={
          //       "content_type":"text",
          //       "title":"Categories",
          //       "payload":"Categories"
          //     };
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
        console.log('contentList',contentList);
        //var msg = 'Hey '+username+', How are you? \n \nDid you check these amazingly cool stuff on Fankick?';
        //console.log("--------:Response data:--------gender ", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },

            "message":{
                "text":'I assume that you are a fan of ' + categoryName + ' browse the amazing stuff we have on ' + categoryName + '',
                //"text":"msg",
                "quick_replies":[
                  {
                    "content_type":"text",
                    "title":name1.slice(0,20),
                    "payload":rows[0].result.name
                  },
                  {
                    "content_type":"text",
                    "title":name2.slice(0,20),
                    "payload":rows[1].result.name
                  },
                  {
                    "content_type":"text",
                    "title":name3.slice(0,20),
                    "payload":rows[2].result.name
                  },
                  {
                    "content_type":"text",
                    "title":name4.slice(0,20),
                    "payload":rows[3].result.name
                  },
                  {
                    "content_type":"text",
                    "title":name5.slice(0,20),
                    "payload":rows[4].result.name
                  }
                  // ,
                  // {
                  //   "content_type":"text",
                  //   "title":name4.slice(0,20),
                  //   "payload":rows[5].result.name
                  // },
                  // {
                  //   "content_type":"text",
                  //   "title":name4.slice(0,20),
                  //   "payload":rows[6].result.name
                  // },
                  // {
                  //   "content_type":"text",
                  //   "title":name4.slice(0,20),
                  //   "payload":rows[7].result.name
                  // },
                  // {
                  //   "content_type":"text",
                  //   "title":name4.slice(0,20),
                  //   "payload":rows[8].result.name
                  // },
                  // {
                  //   "content_type":"text",
                  //   "title":name4.slice(0,20),
                  //   "payload":rows[9].result.name
                  // }

                ]
              }
            }
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

          pool.getConnection(function(err, connection) {
            connection.query('INSERT INTO cc_user_preference(facebookId, firstName, lastName, fullName, gender, locale, timeZone)VALUES(?,?,?,?,?,?,?)',[senderID, userfname, userlname, userFullName, userfbdata.gender, userfbdata.locale,userfbdata.timezone], function(err, rows) {
                if (err) {
                    console.log("Error While retriving content pack data from database:", err);
                } else {
                    console.log("No Data Found From Database");
                    sendHelpMessage(event);
                    //sendImageMessage(event);
                }
                connection.release();
            });
            });

            pool.getConnection(function(err, connection) {
              connection.query('update cc_user_preference set language="Telugu" where facebookId=?',[senderID], function(err, rows) {
                  if (err) {
                      console.log("Error While retriving content pack data from database:", err);
                  } else {
                      console.log("No Data Found From Database");
                      sendHelpMessage(event);
                      //sendImageMessage(event);
                  }
                  connection.release();
              });
              });

        //fbuserlocation();
        //var msg = 'Hi '+username+', A lot of exciting things are awaiting for you! Get kicking!';
        //var msg = 'Hi '+username+'! My name is Kicker.\n How may I come of any help to you today?';
    //var msg = 'Hi '+username+'! My name is Kicker.\n \nI can help you get closer to your favorite celebrity with a lot of exciting things about them.\n\n Choose what excites you more';
  var msg = 'Entertainment matters! \n\n Welcome to the big zone, select your preferences…';
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


// function geoFindMe() {
//   //var output = document.getElementById("out");
//
//   // if (!navigator.geolocation){
//   //   output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
//   //   return;
//   // }
//
//   function success(position) {
//     var latitude  = position.coords.latitude;
//     var longitude = position.coords.longitude;
//     console.log("latitude");
//     console.log("longitude");
//
//
//     //output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>';
//
//     // var img = new Image();
//     // img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
//     //
//     // output.appendChild(img);
//   }
//
//   function error() {
//     //output.innerHTML = "Unable to retrieve your location";
//     console.log("Unable to retrieve your location");
//   }
//
//   //output.innerHTML = "<p>Locating…</p>";
//
//   navigator.geolocation.getCurrentPosition(success, error);
// }







module.exports = {
  sendContentPacks: sendContentPacks,
  //fbuserdetails:fbuserdetails,
  // name:name,
  quickMenu:quickMenu
};

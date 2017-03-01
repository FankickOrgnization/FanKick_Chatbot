'use strict';
var request = require('request');
const searchText = require('./search.js');
const thread = require('./thread.js');
var googleTrends = require('google-trends-api');
const movies = require('../contentjson/movies.json');
const   errors = require('../contentjson/errormsg.json');
const   movies = require('../contentjson/moviesmsg.json');
const   sports = require('../contentjson/sportsmsg.json');
const   tv_shows = require('../contentjson/tvshowsmsg.json');
const   music = require('../contentjson/musicmsg.json');
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
        var senderID = event.sender.id;
        thread.persistentMenu(fbpage_access_token);
        fbuserdetails(event, senderID);
        console.log("categoryName", categoryName);
    }else if (categoryName == "pawan kalyan" || categoryName == "nagarjuna" || categoryName == "chiranjeevi" || categoryName == "allu arjun"|| categoryName == "bala krishna" || categoryName == "mahesh babu") {
    //  celebritiesdetails(categoryName,event);
      googlegraph(categoryName,event);
    }else if (categoryName == "hi" || categoryName == "hello" || categoryName == "hey") {
        wishingmessage(categoryName,event);
    }else if (categoryName == "hollywood" || categoryName == "tollywood" || categoryName == "bollywood" || categoryName == "kollywood" || categoryName == "classical music" || categoryName == "western music") {
      subcategorydetails(categoryName,event);
      usersubcategory(event, categoryName);
    }else if (categoryName == "cricket" || categoryName == "soccer" || categoryName == "football" || categoryName == "tennis" || categoryName == "badminton") {
      //celebritiesdetails(categoryName,event);
      //googlegraph(categoryName,event);
      usersubcategory(event, categoryName);
      subcategorydetails(categoryName,event);
    }else if (categoryName =="akshay kumar" || categoryName =="shahrukh khan" || categoryName =="aamir khan" || categoryName =="ranveer singh" || categoryName =="hrithik roshan") {
      //googletrendsfun(categoryName,event);
      googlegraph(categoryName,event);
    }else if (categoryName =="virat kohli" || categoryName =="rohit sharma" || categoryName =="yuvraj singh" || categoryName =="sachin tendulkar" || categoryName =="dhoni") {
      //googletrendsfun(categoryName,event);
      googlegraph(categoryName,event);
      //googletrendsfun(categoryName,event);
    }else if (categoryName =="movies" || categoryName =="sports" || categoryName =="tv shows"|| categoryName =="music"  || categoryName =="home" ) {
      //allcategory(event, categoryName);
      submenu(event, categoryName);
      console.log("enter into the allcategory function");
    }else {
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


//googleTrends node madule *************
googleTrends.hotTrends('IN')
    .then(function(results){
      console.log("googleTrends.hotTrends results",results);
    })
    .catch(function(err){
        console.log("googleTrends.hotTrends err", err);
      });
}
//googleTrends node madule **************

//subcategorydetails*************************************************************************
    function subcategorydetails(categoryName,event){
          pool.getConnection(function(err, connection) {
            //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
            //connection.query('select * from cc_celebrity_preference where subCategory = ?',[categoryName],function(err, rows) {
            connection.query('select * from cc_celebrity_preference where subCategory=(select id from cc_subcategories where subCategoryName= ? ) order by id desc',[categoryName], function(err, rows) {
                if (err) {
                    console.log("Error While retriving content pack data from database:", err);
                } else if (rows.length) {
                    var senderID = event.sender.id;
                    var contentList = [];
                    var quickList = [];
                  //  var movieslist;
                    console.log("*******cc_celebrity_preference data from database:*********", rows);

                    for (var i = 0; i < rows.length; i++) { //Construct request body
                      var res1 = rows[i].id +",";
                      var res2 = rows[i].celebrityName +",";
                      var res3 = res2.concat(res1);
                      var res5 = res3.concat(res2);
                        var keyMap = {
                            "title": rows[i].celebrityName,
                            "image_url": rows[i].celebrityImageUrl,
                            "subtitle":rows[i].description,
                          //  "item_url": rows[i].image_url,
                            "buttons": [
                              {
                                "type":"web_url",
                                "url": rows[i].facebookHandle,
                                "title":"Facebook"
                            },
                            {
                              "type":"web_url",
                              "url": rows[i].twitterHandle,
                              "title":"Twitter"
                            },
                            {
                            "type": "postback",
                            "title": "More Info",
                            "payload": rows[i].id
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
                            "quick_replies":quickreply
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

//subcategorydetails end *********************************************
//celebritiesdetails***************************************************
function celebritiesdetails(categoryName,event){
  pool.getConnection(function(err, connection) {
    //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
    connection.query('select * from cc_celebrity_preference where celebrityName = ?',[categoryName], function(err, rows) {
      if (err) {
            console.log("Error While retriving content pack data from database:", err);
        } else if (rows.length) {
            var senderID = event.sender.id;
            var contentList = [];
            var quickList = [];
            var movieslist;
            console.log("*******cc_celebrity_preference data from database:*********", rows);

            for (var i = 0; i < rows.length; i++) { //Construct request body
                var keyMap = {
                    "title": rows[i].celebrityName,
                    "image_url": rows[i].celebrityImageUrl,
                    "subtitle":rows[i].description,
                  //  "item_url": rows[i].image_url,
                    "buttons":[
                    {
                        "type":"web_url",
                        "url": rows[i].facebookHandle,
                        "title":"facebook"
                    },
                    {
                      "type":"web_url",
                      "url": rows[i].twitterHandle,
                      "title":"Twitter"
                    }]
                };
                contentList.push(keyMap);
                movieslist = rows[i].lastFiveMovies;
                console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%",movieslist);
            }
            var myarray = movieslist.split(',');
            for(var i = 0; i < myarray.length; i++)
            {
               console.log(myarray[i]);
              var moviearray = {
                 "content_type":"text",
                 "title":myarray[i],
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
        for (var i = 0; i < 1; i++) {
          var keyMap = {
              "title": rows[i].result.name,
              //"image_url":rows[i].result.image.contentUrl,
              "image_url":rows[i].result.image.contentUrl,
              "subtitle":rows[i].result.detailedDescription.articleBody,
              "buttons": [{
                         "type":"web_url",
                         "url": rows[i].result.image.url,
                         "title":"Read More"
                        }]
                 };
                 contentList.push(keyMap);
               }
for (var i = 0; i < 5; i++) {
       var quickMap = {
                 "content_type":"text",
                 "title":rows[i].result.name,
                 "payload":rows[i].result.name
               };

                 quickList.push(quickMap);
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
                          "quick_replies": quickList
                    }
                }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');
    });
}
// ************************** Googlegraph api End ********************************

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
        // console.log("--------:Response data:-------- ", JSON.stringify(body));
        // console.log("--------:Response data:--------first_name ", userprofiledata.first_name);
        // console.log("--------:Response data:--------last_name ", userprofiledata.last_name);
        // console.log("--------:Response data:--------locale ", userprofiledata.locale);
        // console.log("--------:Response data:-------- timezone", userprofiledata.timezone);
        // console.log("--------:Response data:--------gender ", userprofiledata.gender);

          //Random messages

          var errorString = "";

          while( errorString ===  "")
          {
            var random = Math.floor(Math.random() * errors.length);
            if(errors[random].error.length < 320)   // better be a least one good joke :)
                errorString = errors[random].error;
          }


          //End Randum messages for Unable find the data what user types


        var senderID = event.sender.id;
        //var msg = 'I am sorry '+username+', my senses are gone wrong. Why dont you try a different command...';

        //var msg = 'Hey '+username+', How are you?';
        //console.log("--------:Response data:--------sendHelpMessage1", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":errorString,
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
        // console.log("--------:Response data:--------first_name ", userfbdata.first_name);
        // console.log("--------:Response data:--------last_name ", userfbdata.last_name);
        // console.log("--------:Response data:--------locale ", userfbdata.locale);
        // console.log("--------:Response data:-------- timezone", userfbdata.timezone);
        // console.log("--------:Response data:--------gender ", userfbdata.gender);
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

function wishingmessage(categoryName,event){
  var senderID = event.sender.id;
  //var msg = 'Welcome to the club! \n \nEntertainment is served here, order your preferences…';
  var msg = "Welcome to the Pacific of entertainment! Mark your favorite spots, I'd like to take you for boating...";
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
}


//Random messages for the main Categories
function submenu(event, categoryName){
    var senderID = event.sender.id;
    var submenuname = categoryName.replace(" ", "_");
    var submenuString = "";
          while( submenuString ===  "")
          {
            var random = Math.floor(Math.random() * errors.length);
            if(errors[random].error.length < 320)   // better be a least one good joke :)
                submenuString = errors[random].submenuname;
          }       //var msg = 'I am sorry '+username+', my senses are gone wrong. Why dont you try a different command...';

        //var msg = 'Hey '+username+', How are you?';
        //console.log("--------:Response data:--------sendHelpMessage1", msg);
        var messageData = {
            "recipient": {
                "id": senderID
            },
            "message":{
                "text":errorString,
                //"text":"msg",
                "quick_replies":quickreply
              }
            }
         callSendAPI(messageData,'https://graph.facebook.com/v2.6/592208327626213/messages');    //sendHelpMessageSecond(event, userid);

}



//Ended the Random messages for the main Categories
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

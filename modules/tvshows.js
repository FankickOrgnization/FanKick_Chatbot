'use strict';
var request = require('request');
const searchText = require('./search.js');
var googleTrends = require('google-trends-api');
const errors = require('../contentjson/errormsg.json');
const jokes = require('../contentjson/jokes.json');
const fbRquest = require('./fbapi.js');
const dbpool = require('./mysqlconfig.js');
var mysql = require('mysql');
//var pool = mysql.createPool({connectionLimit: 1, host: 'ap-cdbr-azure-southeast-a.cloudapp.net', user: 'bb603e8108da6e', password: '3e384329', database: 'rankworlddev'});
var pool = dbpool.mysqlpool;
var fbpage_access_token = 'EAADV2VT6AuUBAHyUBL8zV5dYdRCBE7ZCKYQvOWCu2kkWQSV1RCllfvMymjDhXZCBQ93IkOFDpVYjN1E8jCHYpHKdH6uwNuhYAyCGdHOv6VgVZCwI6BZCc3AwAc7CW17yNTXe1YE7GkegMHHz36ax5JZC01zllTmTnAQRe0ZB0U3wZDZD';
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
        "title": "Music 🎶",
        "payload": "Music"
    }, {
        "content_type": "text",
        "title": "TV Shows 📺",
        "payload": "TV Shows"
    }
];

//function tvshowsinfo(messagingEvent, moviename)
const tvshowinfo = (messagingEvent, tvshowname) => {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": "Here you go👉..."
            //"text":msg
        }
    //     "message": {
    //         "attachment": {
    //           "type":"video",
    // "payload":{
    //   "url":"https://www.youtube.com/watch?v=XpAaOER_6iY"
    // }
    //         }
    //     }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvshowsdetails(messagingEvent, tvshowname);
}

const tvcelbrityintro = (event, celbrityname) => {
    var senderID = event.sender.id;
    var msg = 'Interesting! Here is what I know about ' + celbrityname + '';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": msg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvcelbritydetails(event, celbrityname);
}

const tvshowsintro = (messagingEvent, tvshowsmsg) => {
    var senderID = messagingEvent.sender.id;
    //var img = 'https://fankickdev.blob.core.windows.net/images/home_logo.png';
    //var msg = 'Amazing talent! Here is what I know about '+img+'';
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": tvshowsmsg
        }
    };
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
    tvshowsmenu(messagingEvent);
}
const tvcelebrityinfo = (messagingEvent, quickpayloadtext) => {
    var genrearray = quickpayloadtext.split(',');
    var actername = genrearray[0];
    var subCategory = genrearray[1];
    console.log("actername", actername);
    console.log("type", subCategory);
    pool.getConnection(function(err, connection) {
        connection.query('select * from cc_tvshows_celebrity_preference where name = ?', [actername], function(err, rows) {
            console.log("********filmactor*********", actername);
            //console.log("*************************-after", categoryName);
            console.log("*************************filmactor", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                var celebrityname;
                var keyMap;
                for (var i = 0; i < rows.length; i++) { //Construct request body
                    celebrityname = rows[i].name;
                    if (subCategory == "%tvcelpics%") {
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture1,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture3,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }, {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture4,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].picture5,
                                                "title": "More Pics"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%tvcelnetworth%") {
                        console.log("celebrity networth");
                        var msg = '' + rows[i].name + '’s net worth is believed to be around ' + rows[i].netWorth + '.';
                        // ’s net worth is believed to be around _____
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": msg,
                                        "image_url": rows[i].picture3,
                                        "subtitle": rows[i].name,
                                        // "buttons": [
                                        // // {
                                        // //     "type":"web_url",
                                        // //    "url": rows[i].picture5,
                                        // //    "title":"More Pics"
                                        // // }
                                        // // {
                                        // //   "type":"element_share"
                                        // // }
                                        // ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%tvcelnews%") {
                        console.log("celebrity news");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].name,
                                        "image_url": rows[i].picture2,
                                        "subtitle": rows[i].name,
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": rows[i].news,
                                                "title": "Click for News"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    } else if (subCategory == "%tvcelawards%") {
                        console.log("celebrity Family");
                        keyMap = {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [
                                    {
                                        "title": rows[i].awards,
                                        "image_url": rows[i].picture4,
                                        "subtitle": rows[i].name
                                        // "buttons": [
                                        // {
                                        //     "type":"web_url",
                                        //    "url": rows[i].picture5,
                                        //    "title":"More Pics"
                                        // }
                                        // ]
                                    }
                                ]
                            }
                        }
                    }
                    //contentList.push(keyMap);
                }

                var messageData = {
                    "recipient": {
                        "id": senderID
                    },
                    "message": {
                        "attachment": keyMap,
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": celebrityname + ' ,%tvcelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": celebrityname + ' ,%tvcelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": celebrityname + ' ,%tvcelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": celebrityname + ' ,%tvcelnews%'
                            }, {
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });
}

const gettvshowsgenre=(messagingEvent, quickpayloadtext)=>{
  var tvgenrearray = quickpayloadtext.split(',');
  var tvgenrename = tvgenrearray[0];
  var subCategory = tvgenrearray[1];
  console.log("Tvgenrename", tvgenrename);
  console.log("type", subCategory);
  pool.getConnection(function(err, connection) {
      connection.query('select * from cc_tvshows where subCategory =(select id from cc_subcategories where subCategoryName= ?) order by id desc',[tvgenrename], function(err, rows) {
          console.log("*************************tvshowsmenu", rows);
          if (err) {
              console.log("Error While retriving content pack data from database:", err);
          } else if (rows.length) {
              var senderID = messagingEvent.sender.id;
              var contentList = [];
              if (rows.length > 10) {
                  var rowslenth = 10;
                  console.log("more than 10 Rows", rowslenth);
              } else {
                  var rowslenth = rows.length;
                  console.log("less than 10 Rows", rowslenth);
              }
              for (var i = 0; i < rowslenth; i++) { //Construct request body
                  var keyMap = {
                      "title": rows[i].name,
                      "image_url": rows[i].picture1,
                      "buttons": [
                          {
                              "type": "postback",
                              "title": "More Info",
                              "payload": rows[i].name + ' %tvshows%'
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
                      "quick_replies": [
                          {
                              "content_type": "text",
                              "title": "Romantic Comedy",
                              "payload": 'Romantic Comedy'
                          }, {
                              "content_type": "text",
                              "title": "Reality",
                              "payload": 'Reality'
                          }, {
                              "content_type": "text",
                              "title": "Horror / Crime",
                              "payload": 'Horror / Crime'
                          },{
                              "content_type": "text",
                              "title": "Watch TV Shows",
                              "payload": 'Watch TV Shows,tv shows,%QR%'
                          }, {
                              "content_type": "text",
                              "title": "Jokes",
                              "payload": "Jokes"
                          },  {
                              "content_type": "text",
                              "title": "Home 🏠",
                              "payload": "home"
                          }
                      ]
                  }
              }
              fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
          } else {
              console.log("No Data Found From Database");
              sendHelpMessage(messagingEvent);
          }
          connection.release();
      });
  });


}

function tvcelbritydetails(event, celbrityname) {
    pool.getConnection(function(err, connection) {
        //connection.query('select * from cc_celebrity_preference where celebrityName=?',[categoryName], function(err, rows) {
        connection.query('select * from cc_tvshows_celebrity_preference where name = ?', [celbrityname], function(err, rows) {
            console.log("***Tv Show celebrity details:", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = event.sender.id;
                var contentList = [];
                var quickList = [];
                var movieslist;
                console.log("*******cc_celebrity_preference data from database:*********", rows);

                for (var i = 0; i < rows.length; i++) { //Construct request body
                    var name = rows[i].name;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "subtitle": rows[i].skill,
                        //  "item_url": rows[i].image_url,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].personalInfo,
                                "title": "About"
                            }, {
                                "type": "web_url",
                                "url": rows[i].googleSearch,
                                "title": "Search in Google"
                            }, {
                                "type": "web_url",
                                "url": rows[i].news,
                                "title": "News"
                            }
                        ]
                    };
                    contentList.push(keyMap);
                    //  movieslist = rows[i].lastFiveMovies;
                    //  console.log("%%%%%%%%%%%%movieslist%%%%%%%%%%%%%", movieslist);
                }
                //var myarray = movieslist.split(',');
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
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Pictures",
                                "payload": name + ' ,%tvcelpics%'
                            }, {
                                "content_type": "text",
                                "title": "Awards",
                                "payload": name + ' ,%tvcelawards%'
                            }, {
                                "content_type": "text",
                                "title": "Net Worth",
                                "payload": name + ' ,%tvcelnetworth%'
                            }, {
                                "content_type": "text",
                                "title": "News",
                                "payload": name + ' ,%tvcelnews%'
                            }, {
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(event);
                //sendImageMessage(event);
            }
            connection.release();
        });
    });
}

function tvshowsmenu(messagingEvent) {
    pool.getConnection(function(err, connection) {
        connection.query('select  * from cc_tvshows order by id desc', function(err, rows) {
            console.log("*************************tvshowsmenu", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                if (rows.length > 10) {
                    var rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    var rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "More Info",
                                "payload": rows[i].name + ' %tvshows%'
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
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": "Romantic Comedy",
                                "payload": 'Romantic Comedy'
                            }, {
                                "content_type": "text",
                                "title": "Reality",
                                "payload": 'Reality'
                            }, {
                                "content_type": "text",
                                "title": "Horror / Crime",
                                "payload": 'Horror / Crime'
                            },{
                                "content_type": "text",
                                "title": "Watch TV Shows",
                                "payload": 'Watch TV Shows,tv shows,%QR%'
                            }, {
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}

function tvshowsdetails(messagingEvent, tvshowname) {
    var tvshowname = tvshowname.trim();
    var tvshowleadActor;
    var tvshowleadActress;
    console.log("tvshowname:", tvshowname);
    pool.getConnection(function(err, connection) {
        connection.query('select  * from cc_tvshows where name = ?', [tvshowname], function(err, rows) {
            console.log("*************************tvshowsdetails", rows);
            if (err) {
                console.log("Error While retriving content pack data from database:", err);
            } else if (rows.length) {
                var senderID = messagingEvent.sender.id;
                var contentList = [];
                if (rows.length > 10) {
                    var rowslenth = 10;
                    console.log("more than 10 Rows", rowslenth);
                } else {
                    var rowslenth = rows.length;
                    console.log("less than 10 Rows", rowslenth);
                }
                for (var i = 0; i < rowslenth; i++) { //Construct request body
                    tvshowleadActor = rows[i].leadActor;
                    tvshowleadActress = rows[i].leadActress;
                    var keyMap = {
                        "title": rows[i].name,
                        "image_url": rows[i].picture1,
                        "buttons": [
                            {
                                "type": "web_url",
                                "url": rows[i].clips,
                                "title": "Clips"
                            }, {
                                "type": "web_url",
                                "url": rows[i].googleSearch,
                                "title": "About"
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
                        "quick_replies": [
                            {
                                "content_type": "text",
                                "title": tvshowleadActor,
                                "payload": tvshowleadActor + ' %tvcel%'
                            }, {
                                "content_type": "text",
                                "title": tvshowleadActress,
                                "payload": tvshowleadActress + ' %tvcel%'
                            }, {
                                "content_type": "text",
                                "title": "Jokes",
                                "payload": "Jokes"
                            }, {
                                "content_type": "text",
                                "title": "Home 🏠",
                                "payload": "home"
                            }
                        ]
                    }
                }
                fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
            } else {
                console.log("No Data Found From Database");
                sendHelpMessage(messagingEvent);
            }
            connection.release();
        });
    });

}



function sendHelpMessage(event) {
    var errorString = "";
    while (errorString === "") {
        var random = Math.floor(Math.random() * errors.length);
        if (errors[random].error.length < 320) // better be a least one good joke :)
            errorString = errors[random].error;
        }
    var senderID = event.sender.id;
    var messageData = {
        "recipient": {
            "id": senderID
        },
        "message": {
            "text": errorString,
            //"text":"msg",
            "quick_replies": quickreply
        }
    }
    fbRquest.callFBAPI(messageData, 'https://graph.facebook.com/v2.6/592208327626213/messages');
}

module.exports = {
    tvshowsintro: tvshowsintro,
    tvshowinfo: tvshowinfo,
    tvcelbrityintro: tvcelbrityintro,
    tvcelebrityinfo: tvcelebrityinfo,
    gettvshowsgenre:gettvshowsgenre
};

'use strict';
var request = require('request');
//console.log("------:thread:-----");

const persistentMenu = (accessToken) => {
    console.log("accessToken for thread:-----", accessToken);
    var body = {
        "setting_type": "call_to_actions",
        "thread_state": "existing_thread",
        "call_to_actions": [
            {
                "type": "postback",
                "title": "Help",
                "payload": "home"
            }, {
                "title": "Choose Categories",
                "type":"nested",
                 "call_to_actions":[
                   {
                     "title":"Pay Bill",
                     "type":"postback",
                     "payload":"PAYBILL_PAYLOAD"
                   },
                   {
                     "title":"History",
                     "type":"postback",
                     "payload":"HISTORY_PAYLOAD"
                   },
                   {
                     "title":"Contact Info",
                     "type":"postback",
                     "payload":"CONTACT_INFO_PAYLOAD"
                   }
                 ]
            }, {
                "type": "web_url",
                "title": "Download Fankick App",
                "url": "http://google.com/"
            },{
                "type": "web_url",
                "title": "Fankick website",
                "url": "http://google.com/"
            },{
                "type": "web_url",
                "title": "Fankick App",
                "url": "http://google.com/"
            }
        ]
    };
    // var body = {
    //   "persistent_menu":[
    //     {
    //       "locale":"default",
    //       "composer_input_disabled":true,
    //       "call_to_actions":[
    //         {
    //           "title":"My Account",
    //           "type":"nested",
    //           "call_to_actions":[
    //             {
    //               "title":"Pay Bill",
    //               "type":"postback",
    //               "payload":"PAYBILL_PAYLOAD"
    //             },
    //             {
    //               "title":"History",
    //               "type":"postback",
    //               "payload":"HISTORY_PAYLOAD"
    //             },
    //             {
    //               "title":"Contact Info",
    //               "type":"postback",
    //               "payload":"CONTACT_INFO_PAYLOAD"
    //             }
    //           ]
    //         },
    //         {
    //           "type":"web_url",
    //           "title":"Latest News",
    //           "url":"http://petershats.parseapp.com/hat-news",
    //           "webview_height_ratio":"full"
    //         }
    //       ]
    //     },
    //     {
    //       "locale":"en_US",
    //       "composer_input_disabled":false
    //     }
    //   ],
    //
    // };
    request({
        uri: 'https://graph.facebook.com/v2.6/me/thread_settings?access_token=' + accessToken,
        headers: {
            "Content-Type": "application/json"
        },
        method: 'POST',
        json: body
    }, function(error, response) {
        if (error) {
            console.log("Error While geting response from Wit:", error);
        } else {
            console.log("Success While geting response from facebook thread:", response.body);
        }
    });
};

// const fbuserdetails = (event, userid) => {
//
//
// };

module.exports = {
    persistentMenu: persistentMenu
};

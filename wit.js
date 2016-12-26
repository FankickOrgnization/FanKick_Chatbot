'use strict';
var request = require('request');
const fb = require('./app.js');
//const Wit2;
//fb.myvar = 'Hello Face book**********Hello Face book';
//fb.test1();
var name = "foobar";
var witvalue;
// export it
//exports.name = name;

console.log("Hi Welcome to Wit");
//function wittest(msgwit_value){
const wittest = (msgwit_value) => {
  console.log("Hi Welcome to Wit",msgwit_value);
};

// function displayName() {
//   function myName() {
//     return "Sravan Kumar"
//   }
//   return myName();
// }
var msgwit_value;
const getwitmessageText = (msgwit) => {
  request({
      uri: 'https://api.wit.ai/message?v=20160526&q='+ msgwit,
      headers: {
          "Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX"
      }
  }, function(error, response) {
      if (error) {
          console.log("Error While geting response from Wit:", error);
      } else {
        var res = JSON.stringify(response);
        var res_data = response.body;
        var wit_res_data = JSON.parse(res_data);
        var wit_res_data_ent = wit_res_data.entities;
        var wit_res_data_intent =  wit_res_data_ent.intent;
        var wit_res_data_location = wit_res_data_ent.location;
        var wit_res_msg_id = wit_res_data.msg_id;

          // console.log("Response from Wit--Reswit", res);
          // console.log("Response from Wit--msg_idwit", wit_res_data.msg_id);
          // console.log("Response from Wit************wit1", wit_res_data.entities);
          // console.log("Response from Wit************wit2", wit_res_data_ent.intent);
          // console.log("Response from Wit************wit3", wit_res_data_ent.location);
          // console.log("Response from Wit************wit4", wit_res_data_intent);
          // console.log("Response from Wit************wit5", wit_res_data_location);
          //console.log("Response from Wit************6", wit_res_data_intent.value);

          for(var i=0;i<wit_res_data_intent.length;i++)
          {
            var td1=wit_res_data_intent[i]["confidence"];
            var td2=wit_res_data_intent[i]["type"];
            var td3=wit_res_data_intent[i]["value"];
          }
          // console.log("confidence************wit5",td1);
          // console.log("type************wit5",td2);
          // console.log("value************wit5", td3);
        msgwit_value = td3;
        // console.log('******msgwit_valuewit', msgwit_value);
        getwitconverse(wit_res_msg_id,msgwit_value,msgwit);
        //return msgwit_value;
        witvalue = msgwit_value;
        exports.witvalue = witvalue;
        //console.log('******msgwit_valuewit2', witvalue);
      }
    //  witvalue = msgwit_value;
  });
//  witvalue = msgwit_value;
};

const getwitmsg = (msg_id,msg_value,msg_text)=> {
// console.log("msg_id***********Wit", msg_id);
// console.log("msg_value***********Wit", msg_value);
// console.log("msg_value***********Wit", msg_text);
var myJSONObject = {
  "intent": msg_value
};
var hederReq = {
        "Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX",
        "Content-Type": "application/json",
         "Accept": "application/json"
    };
//uri: 'https://api.wit.ai/converse?v=20160526&session_id='+msg_id+'&q='+msg_text,
request({
  url: 'https://api.wit.ai/converse?v=20160526&session_id='+msg_id,
  method: "POST",
  json: true,   // <--Very important!!!
  headers:hederReq,
  body: myJSONObject
  },function(error, response, body) {
    console.log("Wit Ai error",error);
    console.log("Wit Ai body*************",body);
    request({
      url: 'https://api.wit.ai/converse?v=20160526&session_id='+msg_id,
      method: "POST",
      json: true,   // <--Very important!!!
      headers:hederReq,
      body: myJSONObject
      },function(error, response, body) {
        // console.log("Wit Ai error",error);
        // console.log("Wit Ai body*************jkhjkhjkhjkhjkh",body);
        //console.log("Wit Ai body1",body.msg);
        if (!error && response.statusCode == 200) {
         console.log("Successfully received Wit Message");
        } else {
            console.error("Unable to send message.");
            //console.error(response);
            console.error("Error while sending message:", error);
        }
    });
    //console.log("Wit Ai body1",body.msg);
    if (!error && response.statusCode == 200) {
     console.log("Successfully received Wit Message");
    } else {
        console.error("Unable to send message.");
        //console.error(response);
        console.error("Error while sending message:", error);
    }
});
}
// End Geting the Wit cenversion Message ************************
function getwitconverse(wit_res_msg_id,msgwit_value,msgwit){
// console.log("getwitconverse***********wit_res_msg_id", wit_res_msg_id);
// console.log("getwitconverse***********msgwit_value", msgwit_value);
// console.log("getwitconverse***********msgwit", msgwit);
var myJSONObject = {
  "intent": msgwit_value
};
var hederReq = {
        "Authorization": "Bearer USTWU2HGSIYGK3JBQX6EM2UGEQOS26ZX",
        "Content-Type": "application/json",
         "Accept": "application/json"
    };
//uri: 'https://api.wit.ai/converse?v=20160526&session_id='+msg_id+'&q='+msg_text,
request({
  url: 'https://api.wit.ai/converse?v=20160526&session_id='+wit_res_msg_id,
  method: "POST",
  json: true,   // <--Very important!!!
  headers:hederReq,
  body: myJSONObject
  },function(error, response, body) {
    console.log("Wit Ai error",error);
    console.log("Wit Ai body*************",body);
    request({
      url: 'https://api.wit.ai/converse?v=20160526&session_id='+wit_res_msg_id,
      method: "POST",
      json: true,   // <--Very important!!!
      headers:hederReq,
      body: myJSONObject
      },function(error, response, body) {
        // console.log("Wit Ai error",error);
        // console.log("Wit Ai body*************jkhjkhjkhjkhjkh",body);
        //console.log("Wit Ai body1",body.msg);
        if (!error && response.statusCode == 200) {
        // console.log("Successfully received Wit Message");
        } else {
            //console.error("Unable to send message.");
            //console.error(response);
            //console.error("Error while sending message:", error);
        }
    });
    //console.log("Wit Ai body1",body.msg);
    if (!error && response.statusCode == 200) {
     console.log("Successfully received Wit Message");
    } else {
        // console.error("Unable to send message.");
        // //console.error(response);
        // console.error("Error while sending message:", error);
    }
});
}

// module.exports = function(initValue) {
//   return {
//     addOne: function() {
//       return initValue + 1;
//     },
//     subtractOne: function() {
//       return initValue - 1;
//     },
//   }
// }

// var value_123 = witvalue;
// console.log("Unable to send message value_123.",value_123 );
module.exports = {
//     test: function() {
//         console.log('var is', this.myvar);
//     },
// function(initValue) {
//   console.log("initValue",initValue);
//   // return {
//   //   addOne: function() {
//   //     return initValue + 1;
//   //   },
//   //   subtractOne: function() {
//   //     return initValue - 1;
//   //   },
//   // }
//   return "initValue";
// },
  // wittest: wittest,
  // name : name,
  // value_123 : value_123,
  // witvalue : witvalue,
  // getWit: getWit,
  getwitmsg: getwitmsg,
  //getwitmessageText: getwitmessageText
};

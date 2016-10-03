'use strict';
var request = require('request');
console.log("------:thread:-----");

const output = (accessToken,categoryName,userid) => {
  console.log("accessToken for thread:-----", accessToken);
  console.log("accessToken for thread:-----", categoryName);
  console.log("accessToken for thread:-----", userid);
}

module.exports = {
  output: output
};

var config = require('../config'); //loads .env vars
var http = require("http");
var async = require('async');

/*************************************************************
Uses Yahoo GEO API to pull State info using a WOEID
of a US town
**************************************************************/

var getStateData = function(woeid, callback) {

  var options = {
    "method": "GET",
    "hostname": "where.yahooapis.com",
    "path": "/v1/place/"+woeid+"?format=json&appid="+config.yahooAPPID
  };

  var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      var result = JSON.parse(body.toString());
      var state = result.place.admin1;

      console.log("state",result.place.admin1);

      if (callback) {
        callback(state);
      }
    });
  });

  req.end();
}

/*************************************************************
Append state information to array of towns
**************************************************************/

exports.addStateData = function(towns, callback) {

  async.each(towns, function(item, next) {

    console.log('Processing town ' + item);

    getStateData(item.woeid, function(state) {
      item['state'] = state;
      console.log("item",item);
      next();
    });

  }, function(error){
      if(error) {
        console.log('A town failed to process');
      } else {
        console.log('All towns have been processed successfully');
        if (callback) {
          callback(towns);
        }
      }
  });
}


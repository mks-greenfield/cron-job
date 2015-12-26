var config = require('../config'); //loads .env vars
var _ = require('underscore');
var http = require("http");

/*************************************************************
Uses Yahoo GEO API to pull State info for a WOEID
http://where.yahooapis.com/v1/place/2352824?format=json&appid=dj0yJmk9OW15eEVuajVDdVZOJmQ9WVdrOVQzb3hUVEp5TXpnbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD03Ng--
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

getStateData(2352824);


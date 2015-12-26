var config = require('../config'); //loads .env vars
var _ = require('underscore');
var twitter = require('twitter'); //Twitter API Client
var usTownTrend = require('../db/models/usTownTrend'); //MongoDB
var moment = require('moment');

/*************************************************************
Twitter Config
All of these process variables live in .env
**************************************************************/

var client = new twitter({
  consumer_key: config.CONSUMER_KEY,
  consumer_secret: config.CONSUMER_SECRET,
  access_token_key: config.ACCESS_TOKEN_KEY,
  access_token_secret: config.ACCESS_TOKEN_SECRET
});

// console.log("env1",config.CONSUMER_KEY);
// console.log("env2",config.CONSUMER_SECRET);
// console.log("env3",config.ACCESS_TOKEN_KEY);
// console.log("env4",config.ACCESS_TOKEN_SECRET);
/*************************************************************
GET trends/available
Gets available towns that have trends in the United States
Returns an array of Towns with WOEIDs
**************************************************************/

exports.getAvailableUSTowns = function(callback) {
  client.get('trends/available', function(err, result, response){
    if (err) {
      console.log("trends available error",err);
      if (err[0].code === 34) {
        console.log("404 Trend availability data Not Found\n");
      }

    } else {
      var us_woeids = [];

      _.each(result, function(item) {
        if (item.countryCode === 'US' && item.placeType.name === 'Town') {

          //push each town onto a queue
          us_woeids.push(item);
        }
      });

      if(callback) {
        callback(us_woeids);
      }
    }
  });
}

/*************************************************************
Process US Towns with available trends
Input: array of towns with available trends
Iterates through town queue, processing 1 town every 2 min to
accomodate Twitter's rate limit. 
Calls fetchTownTrends on each town.
**************************************************************/

exports.processTownQueue = function(queue, callback) {
  //for debugging
  console.log("Date: (UTC)", moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"));
  console.log("Available towns:",queue.length);
  console.log("Found following trends for:");

  var throttle = setInterval(function() {
    if (queue.length) {
      var town = queue.pop();
      fetchTownTrends(town.name, town.state, town.woeid);
    } else {
      clearInterval(throttle);
      if (callback) {
        callback();
      }
      // console.log("DONE WITH THROTTLING");
    }
  },120); //120000 = 2 minutes
}

/*************************************************************
GET trends/place
Saves up to 50 trends to MongoDB for a 
specific US town.
**************************************************************/

function fetchTownTrends(townName, townState, townWOEID) {
  var params = {id: townWOEID};
  // console.log("START",townName);

  client.get('trends/place', params, function(err, result, response){
    if (err) {
      console.log("trends place error",err);

      if (err[0].code === 34) {
        console.log("404 Town Trend Data Not Found\n");
      }

    } else {
      
      console.log(townName,",",townState,result[0].trends.length);

      _.each(result[0].trends, function(item) {
        //console.log(JSON.stringify(item));

        var trend = { 
          trend_name: item.name,
          tweet_volume: item.tweet_volume,
          location_name: townName,
          state: townState,
          woeid: townWOEID,
          url: item.url,
          created_at: result[0].created_at,
          updated_at: Date.now()
        };

        usTownTrend(trend).save(function(err) {
          if (err) throw err;
        });
      });
    }
    // console.log("DONE",townName);
  });
}
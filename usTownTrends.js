require('dotenv').load(); //loads .env vars
var cron = require('cron');
var twitter = require('twitter');
var _ = require('underscore');
var usTownTrend = require('./db/models/usTownTrend');

/*************************************************************
Twitter Config
All of these process variables live in .env
**************************************************************/

var client = new twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

/*************************************************************
GET trends/available
Gets available towns that have trends in the United States
Returns an array of Towns with WOEIDs
**************************************************************/

exports.getAvailableUSTowns = function(callback) {
  client.get('trends/available', function(err, result, response){
    if (err) {
      console.log(err);
      //handle case where Twitter returns a 404
      if (err[0].code === 34) {
        console.log("404 Trend availability data Not Found\n");
      }

    } else {
      //console.log(JSON.stringify(result));
      var us_woeids = [];

      _.each(result, function(item) {
        if (item.countryCode === 'US' && item.placeType.name === 'Town') {

          //push each town onto a queue
          us_woeids.push(item);
        }
      });
      //console.log(us_woeids.length);

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
  var throttle = setInterval(function() {
    if (queue.length) {
      var town = queue.pop();
      fetchTownTrends(town.name, town.woeid);
    } else {
      clearInterval(throttle);
      if (callback) {
        callback(statistics);
      }
      //console.log("DONE WITH THROTTLING");
    }
  },120000); //120000 = 2 minutes
}


/*************************************************************
GET trends/place
Saves up to 50 trends to MongoDB for a 
specific US town.
**************************************************************/

function fetchTownTrends(townName, townWOEID) {
  var params = {id: townWOEID};
  console.log("START",townName);

  client.get('trends/place', params, function(err, result, response){
    if (err) {
      console.log(err);
      //handle case where Twitter returns a 404
      if (err[0].code === 34) {
        console.log("404 Town Trend Data Not Found\n");
      }

    } else {
      
      //console.log(JSON.stringify(result));

      _.each(result[0].trends, function(item) {
        //console.log(JSON.stringify(item));

        var trend = { 
          trend_name: item.name,
          tweet_volume: item.tweet_volume,
          location_name: townName,
          woeid: townWOEID,
          url: item.url,
          created_at: result[0].created_at,
          updated_at: Date.now()
        };

        usTownTrend(trend).save(function(err) {
          if (err) throw err;
          //console.log("entry saved");
          //console.log("item", item);
        });
      });
      //var results = JSON.stringify(tweets);
    }
    console.log("DONE",townName);
  });
}

//fetchTownTrends("San Francisco", 2487956);

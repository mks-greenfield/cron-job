require('dotenv').load(); //loads .env vars
var cron = require('cron');
var twitter = require('twitter');

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
GET trends/place
Top 50 hashtags for a specific region
- tweet volume for the last 24 hours with the specific trend
**************************************************************/
//san francisco
var params = {id: 24865672};

client.get('trends/place', function(error, tweets, response){
  if (error) {
    console.log(error);
  }
  var results = JSON.stringify(tweets);

  console.log(tweets.length);
});

/*************************************************************
Twitter error response:
[ { code: 34, message: 'Sorry, that page does not exist.' } ]
{"errors":[{"code":34,"message":"Sorry, that page does not exist."}]}
**************************************************************/


/************************************************************
Cron Job

15 times every 30 min, 
467 woeids available
*************************************************************/

var CronJob = require('cron').CronJob;
var job = new CronJob('00 30 11 * * 1-5', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  }, function () {
    /* This function is executed when the job stops */
  },
  true, /* Start the job right now */
  timeZone /* Time zone of this job. */
);

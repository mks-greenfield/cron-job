var twitterAPI = require('./app/twitterAPI');
var yahooGeo = require('./app/yahooGeoAPI');
var mailer = require('./app/mailer');
/*************************************************************
Gets available US towns and saves the 
current trends for those towns
**************************************************************/

twitterAPI.getAvailableUSTowns(function(result) {

  // var towns = [];

  // towns.push(result[54]);
  // towns.push(result[51]);

  yahooGeo.addStateData(result, function(results) {

    console.log("done adding states", results);

    twitterAPI.processTownQueue(results, function() {
      //send email when done
      console.log("Hey I'm done processing the town queue");
      mailer.sendMail();
    });
  });
});
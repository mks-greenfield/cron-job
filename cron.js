var twitterAPI = require('./app/twitterAPI');
var yahooGeo = require('./app/yahooGeoAPI');
var mailer = require('./app/mailer');
/*************************************************************
Gets available US towns and saves the 
current trends for those towns
**************************************************************/

twitterAPI.getAvailableUSTowns(function(result) {

  yahooGeo.addStateData(result, function(results) {

    console.log("done adding states", results);

    twitterAPI.processTownQueue(results, function() {
      
      console.log("Hey I'm done processing the town queue");
      //send email when done
      mailer.sendMail();
    });
  });
});
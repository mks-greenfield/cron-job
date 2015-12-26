var twitterAPI = require('./app/twitterAPI');
var mailer = require('./app/mailer');

/*************************************************************
Gets available US towns and saves the 
current trends for those towns
**************************************************************/

twitterAPI.getAvailableUSTowns(function(result) {

  var towns = [];

  towns.push(result[29]);

  twitterAPI.processTownQueue(towns, function() {
    //send email when done
    mailer.sendMail();
  });
});


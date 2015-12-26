var twitterAPI = require('./app/twitterAPI');
var mailer = require('./app/mailer');

/*************************************************************
Gets available US towns and saves the 
current trends for those towns
**************************************************************/

twitterAPI.getAvailableUSTowns(function(result) {

  var towns = [];

  towns.push(result[48]);
  towns.push(result[49]);

  twitterAPI.processTownQueue(towns, function() {
    //send email when done
    mailer.sendMail();
  });
});
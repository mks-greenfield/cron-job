var twitterAPI = require('./twitterAPI');
var mailer = require('./mailer');

/*************************************************************
Gets available US towns and saves the 
current trends for those towns
**************************************************************/

twitterAPI.getAvailableUSTowns(function(result) {

  var towns = [];

  towns.push(result[27]);

  twitterAPI.processTownQueue(towns, function() {
    //send email when done
    mailer.sendMail();
  });
});


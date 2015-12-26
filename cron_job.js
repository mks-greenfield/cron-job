require('dotenv').load(); //loads .env vars
var nodemailer = require('nodemailer');
var usTowns = require('./usTownTrends');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PWD
    }
});

// setup e-mail data
var mailOptions = {
    from: process.env.USER_EMAIL, // sender address
    to: process.env.USER_EMAIL,  // list of receivers
    subject: '✔ Daily Cron Job Finished', // Subject line
    text: 'THIS IS THE FIRST TEST RUN!' // plaintext body
    // html: '<b>Hello world </b>' // html body
};

// send mail with defined transport object
usTowns.getAvailableUSTowns(function(result) {
  // var towns = [];

  // towns.push(result[6]);
  // towns.push(result[7]);
  // towns.push(result[8]);

  usTowns.processTownQueue(result, function() {

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            return console.log(error);
        }
        // console.log('Message sent: ' + info.response);
    });
  });
});


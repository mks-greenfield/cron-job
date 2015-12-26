var config = require('../config'); //loads .env vars
var nodemailer = require('nodemailer');
var fs = require('fs');

/*************************************************************
Emailer
**************************************************************/

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.USER_EMAIL,
        pass: config.USER_PWD
    }
});

// setup e-mail data
var mailOptions = {
    from: config.USER_EMAIL, // sender address
    to: config.USER_EMAIL,  // list of receivers
    subject: '✔ Daily Cron Job Finished', // Subject line
    text: 'See attached log for statistics and error messages.', // plaintext body
    attachments: [
    {   // filename and content type is derived from path
      path: '/Users/psoshnin/Desktop/makersquare/greenfield/cron-job/app/debug.log'
    }]
};

exports.sendMail = function() {
  transporter.sendMail(mailOptions, function(error, info) {
      if(error) {
          return console.log(error);
      }
      console.log('Message sent: ' + info.response + '\n');
  });
}
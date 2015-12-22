require('dotenv').load(); //loads .env vars
var mongoose = require('mongoose');

//local: mongoose.connect('mongodb://localhost/test');
//mongolab:  mongodb://<dbuser>:<dbpassword>@ds035503.mongolab.com:35503/mks-greenfield
mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

db.once("open", function(callback) {
  console.log("We've opened a connection");
});

module.exports = db;






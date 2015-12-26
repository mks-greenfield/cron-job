require('dotenv').load(); //loads .env vars
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

db.once("open", function(callback) {
  console.log("We've opened a connection");
});

module.exports = db;






var mongoose = require('mongoose');
var config = require('../config'); 

mongoose.connect(config.MONGOLAB_URI);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'MongoDB connection error:'));

db.once("open", function(callback) {
  //console.log("We've opened a successful MongoDB connection");
});

module.exports = db;
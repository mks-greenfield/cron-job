var mongoose = require('mongoose');
var config = require('../config'); 

mongoose.connect(config.MONGOLAB_URI);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'Mongo connection error:'));

db.once("open", function(callback) {
  console.log("We've opened a connection");
});

module.exports = db;






var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/googleSearch';
MongoClient.connect(url, function(err, db) {
 if(!err) {
    exports.db = db;
      console.log("Database is connected ... ");
  } else {
      console.log("Error connecting database ... ");
  }
});

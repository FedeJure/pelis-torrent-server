// const MongoClient = require('mongodb').MongoClient; //For real database
const MongoClient = require('mongo-mock').MongoClient; //For mock in-memory database
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/seta';

// Database Name
const dbName = 'seta';

var mongoClient = null;

// Use connect method to connect to the server
exports.getClient = () => {
  return new Promise((res, err) => {
    if (mongoClient != null) {
      res(mongoClient);
      return;
    }
    
    try {
      MongoClient.connect(url, {}, function(initError, client) {
        assert.equal(null, initError);
        console.log("Connected successfully to server Mongod");
        const db = client.db();
        mongoClient = db;
        res(db);
      });
    } catch (error) {
      err(error);
    }
  })
}
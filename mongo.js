var ObjectID = require('bson-objectid');

module.exports = {
  "localhost:27017": {
    "databases": {
      "myproject": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": []
          }
        ]
      },
      "undefined": {
        "collections": [
          {
            "name": "system.namespaces",
            "documents": [
              {
                "name": "system.indexes"
              },
              {
                "name": "documents"
              }
            ]
          },
          {
            "name": "system.indexes",
            "documents": [
              {
                "v": 1,
                "key": {
                  "_id": 1
                },
                "ns": "undefined.documents",
                "name": "_id_",
                "unique": true
              }
            ]
          },
          {
            "name": "documents",
            "documents": [
              {
                "a": 1,
                "_id": ObjectID("602b118e17e8cd4be453b90d")
              },
              {
                "a": 2,
                "_id": ObjectID("602b118e17e8cd4be453b90e"),
                "b": 1
              }
            ]
          }
        ]
      }
    }
  }
}
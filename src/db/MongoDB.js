const MongoClient = require('mongodb').MongoClient;

class MongoDB {

    constructor() {
        this.mongoDBURL = 'mongodb://battle:battle1@ds259711.mlab.com:59711/battle';
        this.dbName = 'battle';
    }

    MongoConnect(mongoCallBack) {

        MongoClient.connect('mongodb://battle:battle1@ds259711.mlab.com:59711/battle', function(err, client) {
            console.log("Connected successfully to server");
            const db = client.db('battle');
            return mongoCallBack(db);
        });
    }
}

module.exports = MongoDB;
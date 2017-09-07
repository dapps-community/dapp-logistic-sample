const mongoose = require('mongoose');

let db = mongoose.connection;

module.exports.mongo = db;

const connectionString = `mongodb://localhost:27017/immla`;

const connect = function () {

    if (db.readyState !== 0) {
        return;
    }

    const opts = {
        server: {
            "auto_reconnect": true,
            poolSize: 10,
            socketOptions: {
                keepAlive: true
            }
        },
        db: {
            numberOfRetries: 5,
            retryMiliSeconds: 1000
        }
    };

    mongoose.connect(connectionString, opts);
};

db.on('connected', function () {
    console.log('Connected to mongo database: ', connectionString);
});

db.on('disconnected', function () {
    console.error('Disconnected from mongo database: ', connectionString);
});

db.on('error', function (err) {
    console.error('Error from mongo db');
    console.error(err.stack.toString());
    process.exit();
});

db.on('open', function () {
    console.log('Open connection to mongo database: ', connectionString);
});

connect();

const userScheme = mongoose.Schema({
    id: String,
    password: String,
    type: {type: String, default: "client"},
    email: String,
    token: String,
    pubkey: String
});

module.exports.User = mongoose.model('User', userScheme);

/* jslint node: true */
"use strict";


var connectionInstance, mongodb;

mongodb = require('mongodb');

connectionInstance = void 0;

module.exports = function (cb) {
    var db, server;
    if (connectionInstance) {
        console.info('Connection exists. cb()');
        return cb(connectionInstance);
    } else {
        console.info('Connection doent exist, connecting.');
        server = new mongodb.Server('127.0.0.1', mongodb.Connection.DEFAULT_PORT, {
            auto_reconnect: true
        });
        db = new mongodb.Db('listDb', server);
        return db.open(function (error, databaseConnection) {
            if (error) {
                throw new Error(error);
            }
            /* //start temp code to populate db
            db.collection('lists', {
                strict: true
            }, function (err, collection) {
                if (err) {
                    console.log("The 'lists' collection doesn't exist. Creating it with sample data...");
                    populateDBLists(db);
                }
            });
            db.collection('users', {
                strict: true
            }, function (err, collection) {
                if (err) {
                    console.log("The 'users' collection doesn't exist. Creating it with sample data...");
                    populateDBUsers(db);
                }
            });
            //end temp code to populate db*/
            connectionInstance = databaseConnection;
            console.info('Connection established, cb()');
            cb(databaseConnection);
        });
    }
};




//populate database with sample data
var populateDBLists = function (database) {

    var lists = [{
        name: "Shopping list",
        description: "Used when going at the Masoutis",
        rights: [{
            user_id: "1",
            access: 0 //owner
        }, {
            user_id: "2",
            access: 1 //read_write
        }],
        createdAt: new Date(),
        updatedAt: "",
        listItems: [{
            _id: "1",
            name: "Water",
            type: "Every day stuff",
            quantity: 6,
            notes: "prefer loutraki",
            isActive: true,
            createdAt: new Date(),
            updatedAt: ""
        }]
    }, {
        name: "Grocery List",
        description: "Used never",
        rights: [{
            user_id: "2",
            access: 0 //owner
        }, {
            user_id: "1",
            access: 1 //read_write
        }],
        createdAt: new Date(),
        updatedAt: "",
        listItems: [{
            _id: "2",
            name: "Tomatos",
            type: "Every day stuff",
            quantity: 3,
            notes: "prefer red ones",
            isActive: true,
            createdAt: new Date(),
            updatedAt: ""
        }]
    }];

    database.collection('lists', function (err, collection) {
        collection.remove();
    });

};

var populateDBUsers = function (database) {

    var users = [{
        _id: "1",
        email: "fgiannar@dotsoft.gr",
        password: "lala",
    }, {
        _id: "2",
        email: "lebowski2121@hotmail.com",
        password: "lala"
    }];

    database.collection('users', function (err, collection) {
        collection.remove();
    });
};

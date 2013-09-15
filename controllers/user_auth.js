/* jslint node: true */
"use strict";


var connection, mongo, express;
mongo = require('mongodb');
connection = require('../connection');


exports.auth_user = function (req, res, next) {
    var header = req.headers['authorization']; // get the header
    if (!header) {
       res.setHeader('WWW-Authenticate', 'Basic realm="insert realm"');
        return next("Authorization needed", 401);
    }

    var token = header.split(/\s+/).pop() || '', // and the encoded auth token
        auth = new Buffer(token, 'base64').toString(), // convert from base64
        parts = auth.split(/:/), // split on colon
        email = parts[0] || '',
        pass = parts[1] || '';

    return connection(function (db) {
        db.collection('users', function (errCollection, collection) {
            collection.findOne({
                'email': email
            }, function (err, user) {

                if (err) {
                    return next('An Error occured', 500);
                }
                // no user then an account was not found for that email address
                if (!user) {
                    return next('Unknown email address ' + email, 404);
                }

                // If we have a user lets compare the provided password with the
                // user's passwordHash
                if (pass !== user.password) {
                    return next('Invalid Password', 401);
                }

                req.user = user;

                return next();

            });
        });
    });
};

exports.register = function (req, res, next) {
    var header = req.headers['authorization']; // get the header
    if (!header) {
        res.setHeader('WWW-Authenticate', 'Basic realm="insert realm"');
        return next("Authorization needed", 401 );
    }

    var token = header.split(/\s+/).pop() || '', // and the encoded auth token
        auth = new Buffer(token, 'base64').toString(), // convert from base64
        parts = auth.split(/:/), // split on colon
        email = parts[0] || '',
        pass = parts[1] || '';

    return connection(function (database) {
        database.collection('users', function (err, collection) {
            collection.findOne({
                'email': email
            }, function (err, item) {
                if (err) {
                    return next("An error has occured", 500);
                }

                if (item)
                    return next("Email exists", 409);

                collection.insert({"email": email, "password": pass}, {
                    safe: true
                }, function (err, result) {
                    if (err) {
                         return next("An error has occured", 500);
                    }

                    res.send("Registration successful! Welcome " + email);
                });
            });
        });
    });
};

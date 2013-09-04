/* jslint node: true */
"use strict";


var connection, mongo, express;
mongo = require('mongodb');
connection = require('../connection');


exports.auth_user = function (req, res, next) {
    var header = req.headers['authorization']; // get the header
    if (!header)
        next("Authorization needed");

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
                    return next('An Error occured');
                }
                // no user then an account was not found for that email address
                if (!user) {
                    return next('Unknown email address ' + email);
                }

                // If we have a user lets compare the provided password with the
                // user's passwordHash
                if (pass !== user.password) {
                    return next('Invalid Password');
                }

                req.user = user;

                return next();

            });
        });
    });
};

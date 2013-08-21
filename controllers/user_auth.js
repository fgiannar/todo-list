(function() {
var connection, mongo, constrains;
mongo = require('mongodb');
connection = require('../connection');

'use strict';

/**
* user_auth provides routes for POST authentication.
*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function (user, done) {
 done(null, user._id);
});

// deserializeUser is passed a function that will return the user the
// belongs to an id.
passport.deserializeUser(function (id, fn) {
	 return connection(function(db) {
		db.collection('users', function(errCollection, collection) {
			collection.findOne({'_id': id}, function(err, user) {
				fn(err, user);	
			});
		});
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
 // We are using email for verification so we set the name of 
 // usernameField ot 'email'. This allows use to post: eamil and
 // password
 { usernameField: 'email' ,  passwordField: 'password'},
 // This is the callback function it will be passed the eamil and
 // password that have been supmited.
 function (email, password, fn) {
 	 // We need to look up the user by email address
 	return connection(function(db) {
		db.collection('users', function(errCollection, collection) {
			collection.findOne({'email': email}, function(err, user) {
				if (err) {
					return fn(err, false, { message: 'An Error occured' });
			    }
			    // no user then an account was not found for that email address
				if (!user) {
					return fn(err, false, { message: 'Unknown email address ' + email });
				}

				// If we have a user lets compare the provided password with the
     			// user's passwordHash
				if (password !== user.password) {
					return fn(null, false, { message: 'Invalid Password' });
				}
					
				return fn(err, user);

			});
		});
    });
}));

// POST */auth/local
exports.auth = function (req, res, fn) {
 passport.authenticate('local', function (err, user, info) {
   if (err) {
     return fn(err);
   }
   if (!user) {
     return res.redirect('/');
   }

   req.logIn(user, function (err) {
     if (err) {
       return fn(err);
     }
     console.log("ok");
     return res.redirect('/lists');
   });
 })(req, res, fn);
};

}).call(this);

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' }; // Look at the email property in the post request.
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

    // Verify this username and password, call done with the user if it is the correct
    // email and password. Otherwise, call done with false.
    User.findOne({ email: email }, function(err, user) { // fineOne is async, call back function needed.
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // Compare passwords - is 'password' equal to user.password
        user.comparePassword(password, function(err, isMatch) {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false); }

            return done(null, user);
        });
    });
});
// Setup options for JWT Strategy.
// JWT token could be anyware on the request for example in header, body in url....
// Need to specific tell JwtStrategy where to look for the key.
const jwtOptions = {
    // look at a request header called 'authorization' to find token
    // Secret to encode token (defined in authorization.js)
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
// payload is the decoded JWT token. done is a callback that need to be called to authenicate
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    // See if the user ID in the payload exists in our DB. If it does, call 'done' with that
    // other otherwise, call 'done' without a user object.
    User.findById(payload.sub, function(err, user) {
        if (err) { return done(err, false); } // false means no user found.

        if (user) {
            done(null, user); // null means no error, user found.
        } else {
            done(null, false); // null means no error, but no user found.
        }
    });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);

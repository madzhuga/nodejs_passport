/* global require, module, process  */

var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function (passport) {
    "use strict";

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        'local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {

            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function () {
                User.findOne({'local.email': email }, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        return done(
                            null,
                            false,
                            req.flash(
                                'signupMessage',
                                'This email is already used for other account'
                            )
                        );
                    } else {
                        //todo refactor
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);

                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    }
                });
            });
        })
    );

    passport.use(
        'local-login', new LocalStrategy({
            //todo code duplication
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, function (req, email, password, done) {
            //todo move to UserService so that we can split stub data for tests.
            User.findOne({'local.email' : email}, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(
                        null,
                        false,
                        req.flash(
                            'loginMessage',
                            'No user with this email found.'
                        )
                    );
                }

                if (!user.validPassword(password)) {
                    return done(
                        null,
                        false,
                        req.flash(
                            'loginMessage',
                            'Oops! Wrong password!'
                        )
                    );
                }

                return done(null, user);
            });
        })
    );
};



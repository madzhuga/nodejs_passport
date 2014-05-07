/*todo: replaced by acceptance/passport.js, rework and may be delete */
/*global require, describe, it */

//todo create start helper gathering all start config info
var app         = require('../app.js'),
    should      = require('should'),
    supertest   = require('supertest'),
    mongoose    = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/node_tumba_test');

describe('Home page', function () {
    "use strict";

    it ('should respond ok', function (done) {
        supertest(app).
            get('/').
            end( function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should have Node Authentication header', function (done) {
        supertest(app).
            get('/').
            end( function (err, res) {
                var re = /<h1>.*Node Authentication<\/h1>/;
                res.text.search(re).should.not.equal(-1, "Not found");
                done();
            });
    });

    it ('should have Local Login button', function (done){
        supertest(app).
            get('/').
            end( function (err, res){
                var re = /<a href="\/login".*Local Login<\/a>/;
                res.text.search(re).should.not.equal(-1, "Not found");
                done();
            });
    });
    it ('should have Signup button', function (done) {
        supertest(app).
            get('/').
            end( function (err, res) {
                var re = /<a href="\/signup".*Signup<\/a>/;
                res.text.search(re).should.not.equal(-1, "Not found");
                done();
            });
    });

});

describe('Login page', function () {
    "use strict";

    it ('should respond ok', function (done) {
        supertest(app).
            get('/login').
            end( function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should have email field');
    it ('should have password field');
    it ('should have login button ');
    it ('should have Signup link');
    it ('should have home link');

});

describe ('Login request', function () {
    "use strict";
    //post '/login'
    it ('should login with correct data');
    it ('should redirect to profile page');
    it ('should redirect to signup on failed login attempt');
    it ('should show error messages when no such user');
    it ('should show error messages when password is wrong');

});

describe ('Sign up page', function () {
    "use strict";

    it ('should respond ok', function (done) {
        supertest(app).
            get('/signup').
            end( function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should have a form');
    it ('should have email field');
});

//describe ('Sign up request', function () {
////    app.post('/signup', passport.authenticate('local-signup', {
////        successRedirect : '/profile',
////        failureRedirect : '/signup',
////        failureFlash : true
////    }));
//
//});
//
//describe ('Profile page', function () {
//    //profile
//    //check for not logined users to redirect to home page
////    app.get('/profile', isLoggedIn, function (req, res) {
////        res.render('profile', {user: req.user});
////    });
//    done();
//});
//
//describe ('Log out request', function () {
////    app.get('/logout', function (req, res) {
////        req.logout();
////        res.redirect('/');
////    });
//    done();
//});

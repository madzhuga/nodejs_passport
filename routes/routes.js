/*global module, app */

module.exports = function (app, passport) {
    "use strict";
    //todo split all routes to different modules
    //home page
    app.get('/', function (req, res) {
        res.render('index');
    });

    //login
    app.get('/login', function (req, res) {
        //todo refactor, may be change to middleware
        var flash = req.flash();
        var messages = [];

        if (typeof flash.signupMessage !== 'undefined') {
            messages.push(flash.signupMessage[0]);
        }


        if (typeof flash.loginMessage !== 'undefined') {
            messages.push(flash.loginMessage);
        }

        if (typeof flash.error !== 'undefined') {
            messages.push(flash.error);
        }

        res.render('login', { message: messages.join(', ') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));


    //signup
    app.get('/signup', function (req, res) {

        //todo refactor, may be change to middleware
        var flash = req.flash();
        var messages = [];

        if (typeof flash.signupMessage !== 'undefined') {
            messages.push(flash.signupMessage[0]);
        }

        if (typeof flash.loginMessage !== 'undefined') {
            messages.push(flash.loginMessage);
        }

        if (typeof flash.error !== 'undefined') {
            messages.push(flash.error);
        }

        res.render('signup', { message: messages.join(', ') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));


    //profile
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile', {user: req.user});
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    "use strict";

    if (req.isAuthenticated()){
        return next();
    }

    res.redirect('/');
}
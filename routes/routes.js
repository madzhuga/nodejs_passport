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
        res.render('login', { message: req.flash('loginMessage') });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));


    //signup
    app.get('/signup', function (req, res) {
        res.render('signup', { message: req.flash('signupMessage') });
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
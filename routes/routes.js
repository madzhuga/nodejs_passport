/*global module, app, require */

var Todo = require('../app/models/todo');

module.exports = function (app, passport) {
    "use strict";
    //todo split all routes to different modules
    //home page
    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/api/todos', function (req, res) {

        Todo.find(function (err, todos) {
            if (err) {
                res.send(err);
            }

            res.json(todos);
        });
    });

    app.post('/api/todos', function(req, res) {
        Todo.create({
            text : req.body.text,
            done : false
        }, function (err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find(function(err, todos) {
                if (err) {
                    res.send(err);
                }

                res.json(todos);
            });
        });
    });

    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function( err, todo) {
            if (err) {
                res.send(err);
            }

            Todo.find( function (err, todos) {
                if (err) {
                    res.send(err);
                }

                res.json(todos);
            });
        });
    });


    //login
    app.get('/login', function (req, res) {
        res.render('login', { message: joinFlashMessages(req) });
    });
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));

    //signup
    app.get('/signup', function (req, res) {
        res.render('signup', { message: joinFlashMessages(req) });
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

function joinFlashMessages(req) {
    "use strict";

    var flash = req.flash();
    var message_types = ['signupMessage', 'loginMessage', 'error'];
    var messages = [];

    for (var i = 0; i < message_types.length; i ++ ) {
        if (typeof flash[message_types[i]] !== 'undefined') {
            messages.push(flash[message_types[i]]);
        }
    }

    return messages.join(', ');
}
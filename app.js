/*global require, __dirname, module */

var express = require('express'),
    path = require('path'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    csrf = require('csurf');

var app = express();

var passport = require('passport'),
    flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/note.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({ secret: 'mudotaseventine'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

app.use(function(req, res, next){
    "use strict";
    res.locals.token = req.csrfToken();
    next();
});


//todo check if possible to reuse routes or split routes.js to more generic routes
require('./routes/routes.js')(app, passport);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    "use strict";

    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


//todo add logging and remove duplicate code
/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        "use strict";
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    "use strict";

    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

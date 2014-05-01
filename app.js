/*global require, __dirname, module */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session( {secret: 'onesmallsecret'} ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);



//todo check if possible to reuse routes or split routes.js to more generic routes
//app.use('/', routes);
//app.use('/users', users);
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

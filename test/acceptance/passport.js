/*global require, before, console, after, describe, it, beforeEach */

var Browser = require('zombie'),
    app     = require('../../app'),
    should  = require('should'),
    User    = require('../../app/models/user');

var port        =  8765,
    rootUrl     = 'http://localhost:' + port,
    server,
    mongoose;

before(function(done){
    "use strict";

    app.set('port', port);
    mongoose = require('mongoose');
    mongoose.connect(
        'mongodb://127.0.0.1:27017/node_tumba_test'
    );

    server = app.listen(app.get('port'), function() {
        console.log(
                'Express server listening on port ' +
                server.address().port);
    });
    done();
});

after(function (done) {
    "use strict";
    server.close(done);
});

beforeEach(function(done) {
    "use strict";

    var users = mongoose.connection.collections.users;
    users.drop( function(err) {
        //skipping error when no users collection exists
        if (err && err.message !== 'ns not found') {
            done(err);
        }
        done(null);
    });

});


describe('Local Signup Scenario', function() {
    "use strict";

    var email = 'zombie@un.dead',
        password = 'tutupidu';

    it('should allow to signup', function (done) {
        var browser = new Browser();
        browser.visit(rootUrl, function() {
            browser.success.should.be.true;
            browser.clickLink('Signup', function() {
                browser.text('h1').should.eql('Signup');
                browser.
                    fill('email', email).
                    fill('password', password).
                    pressButton('Signup', function(){
                        browser.text('h1').should.eql('Profile Page');
                        browser.text('h3').should.eql('Local');
                        done();
                    });
            });
        });
    });

    it('should not allow to use existing email', function(done){
        //todo refactor remove duplication

        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);

        newUser.save(function (err) {
            if (err) {
                done(err);
            }

            var browser = new Browser();
            browser.visit(rootUrl, function(){
                browser.success.should.be.true;
                browser.clickLink('Signup', function() {
                    browser.text('h1').should.eql('Signup');

                    browser.
                        fill('email', email).
                        fill('password', password).
                        pressButton('Signup', function(){
                            browser.location.pathname.should.eql('/signup');
                            browser.text('h1').should.eql('Signup');
                            browser.text('This email is already used for other account').should.exist;
                            done();
                        });
                });
            });
        });
    });

    it ('should show missing credentials message on blank email', function (done) {
        var browser = new Browser();
        browser.visit(rootUrl + '/signup', function () {
            browser.text('h1').should.eql('Signup');

            browser.
                pressButton('Signup', function() {
                    browser.location.pathname.should.eql('/signup');
                    browser.text('Missing credentials').should.exist;
                    done();
                });
        });
    });


    it ('should show missing credentials message on blank email', function (done) {
        var browser = new Browser();
        browser.visit(rootUrl + '/signup', function () {
            browser.text('h1').should.eql('Signup');

            browser.
                fill('email', email).
                pressButton('Signup', function() {
                    browser.location.pathname.should.eql('/signup');
                    browser.text('Missing credentials').should.exist;
                    done();
                });
        });
    });
});


describe('Login Scenario', function() {
    "use strict";

    var email = 'another@zomb.ie',
        password = 'password';

//    before(function(done) {
//        var newUser = new User();
//        newUser.local.email = email;
//        newUser.local.password = newUser.generateHash(password);
//
//        newUser.save(function (err) {
//            done(err);
//        });
//    });

    it('should show bad credentials when no login', function(done) {
        var browser = new Browser();
        browser.visit(rootUrl + '/login', function () {
            browser.success.should.be.true;
            browser.fill('password', password).
                pressButton('Login', function () {
                    browser.location.pathname.should.eql('/login');
                    browser.text('Missing credentials').should.exist;
                    done();
            });
        });

    });

    it('should show bad credentials when no login', function(done) {
        var browser = new Browser();
        browser.visit(rootUrl + '/login', function () {
            browser.success.should.be.true;
            browser.fill('email', email).
                pressButton('Login', function () {
                    browser.location.pathname.should.eql('/login');
                    browser.text('Missing credentials').should.exist;
                    done();
            });
        });
    });

    it('should allow to login / logout', function (done){

        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);

        newUser.save(function (err) {
            if (err) {
                throw err;
            }

            var browser = new Browser();
            browser.visit(rootUrl, function(){
                browser.success.should.be.true;
                browser.clickLink('Local Login', function() {
                    browser.text('h1').should.eql('Login');

                    browser.
                        fill('email', email).
                        fill('password', password).
                        pressButton('Login', function(){
                            browser.location.pathname.should.eql('/profile');
                            browser.text('h1').should.eql('Profile Page');
                            browser.text('h3').should.eql('Local');

                            browser.
                                clickLink('Logout', function(){
                                browser.location.pathname.should.eql('/');
                                done();
                            });
                        });
                });
            });
        });

    });

    it('should fail with wrong password', function (done){

        var newUser = new User();
        newUser.local.email = email;
        newUser.local.password = newUser.generateHash(password);

        newUser.save(function (err) {
            if (err) {
                throw err;
            }

            var browser = new Browser();
            browser.visit(rootUrl, function(){
                browser.success.should.be.true;
                browser.clickLink('Local Login', function() {
                    browser.text('h1').should.eql('Login');

                    browser.
                        fill('email', email).
                        fill('password', password + '_wrong').
                        pressButton('Login', function(){
                            browser.location.pathname.should.eql('/login');
                            browser.text('Wrong password').should.exist;

                            done();
                        });
                });
            });
        });

    });

    it('should fail with wrong email', function (done) {

        var browser = new Browser();
        browser.visit(rootUrl, function () {
            browser.success.should.be.true;
            browser.clickLink('Local Login', function () {
                browser.text('h1').should.eql('Login');

                browser.
                    fill('email', email + '_wrong').
                    fill('password', password + '_wrong').
                    pressButton('Login', function () {
                        browser.location.pathname.should.eql('/login');
                        browser.text('No user with this email found').should.exist;

                        done();
                    });
            });
        });

    });

});

/*global require, describe, it */

var app         = require('../app.js'),
    expect      = require('expect.js'),
    supertest   = require('supertest');

//describe('Passport: Local Strategy', function () {
//    "use strict";
//
//    it ('should pass', function (done) {
//
//        done();
//    });
//
//    it ('should fail', function (done) {
//        throw "don't pass";
//    });
//});

describe('Home page', function () {
    "use strict";

    it ('should respond ok', function (done) {
        supertest(app).
            get('/').
            end( function (err, res) {
                expect(res.status).to.equal(200);
                done();
            });
    });

//    it ('should fail', function (done) {
//        throw "don't pass";
//    });
});
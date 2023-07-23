var expect = require('chai').expect;
const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');

describe('setTimeout in a web page', function () {
    var server;
    var page =
        '<html>' +
        '<body>' +
        '<script>' +
        'function delayShowMessage(delay) {' +
        'setTimeout(showMessage, delay);' +
        '}' +
        'function showMessage() {' +
        'document.getElementById("message").style.display = "block";' +
        '}' +
        '</script>' +
        '<label id="message">May the joy be in the hearts</label>' +
        '<button id="show" onmouseup="delayShowMessage(100);">show message</button>' +
        '<script>' +
        'setTimeout(function() {' +
        'document.getElementById("message").style.display = "none";' +
        '}, 200);' +
        '</script>' +
        '</body>' +
        '</html>';

    beforeEach(function (done) {
        server = new LocalServer(page);
        server.start(done);
    });

    afterEach(function (done) {
        server.stop(done);
    });

    it('is considered in the event loop', function (done) {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                expect(
                    browser.document.getElementById('message').style.display
                ).to.equal('none');
            })
            .then(done);
    });

    it('allows to postpone a treatment', function (done) {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                browser.fire('#show', 'mouseup');
            })
            .then(function () {
                expect(
                    browser.document.getElementById('message').style.display
                ).to.equal('none');
            })
            .then(function () {
                return browser.fire('#show', 'mouseup');
            })
            .then(function () {
                expect(
                    browser.document.getElementById('message').style.display
                ).to.equal('block');
            })
            .then(done);
    });

    it('can be triggered programmaticaly', function (done) {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                browser.window.delayShowMessage(100);
            })
            .then(function () {
                browser.wait(200, function () {
                    expect(
                        browser.document.getElementById('message').style.display
                    ).to.equal('block');
                    done();
                });
            });
    });
});

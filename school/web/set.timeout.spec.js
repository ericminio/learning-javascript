const Browser = require('zombie');
const browser = new Browser();

describe('setTimeout in a web page', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var handler = function(request, response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html>' +
            '<body>'+
                '<script>' +
                    'function delayShowMessage(delay) {' +
                        'setTimeout(showMessage, delay);' +
                    '}' +
                    'function showMessage() {' +
                        'document.getElementById("message").style.display = "block";' +
                    '}' +
                '</script>' +

                '<label id="message">May the joy be in the hearts</label>'+
                '<button id="show" onmouseup="delayShowMessage(100);">show message</button>'+

                '<script>' +
                    'setTimeout(function() {' +
                        'document.getElementById("message").style.display = "none";' +
                    '}, 200);' +
                '</script>' +
            '</body>'+
            '</html>';
            response.write(page);
            response.end();
        };

        app = require('http').createServer(handler);
        app.listen(port, done);
    });

    afterEach(function() {
        app.close();
    });

    it('is considered in the event loop', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                expect(browser.document.getElementById('message').style.display).toEqual('none');
            })
            .then(done);
    });

    it('allows to postpone a treatment', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.fire('#show', 'mouseup');
            })
            .then(function() {
                expect(browser.document.getElementById('message').style.display).toEqual('none');
            })
            .then(function() {
                return browser.fire('#show', 'mouseup');
            })
            .then(function() {
                expect(browser.document.getElementById('message').style.display).toEqual('block');
            })
            .then(done);
    });

    it('can be triggered programmaticaly', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.window.delayShowMessage(100);
            })
            .then(function() {
                browser.wait(200, function() {
                    expect(browser.document.getElementById('message').style.display).toEqual('block');
                    done();
                });
            });
    });
});

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
                    'function showMessage() {' +
                        'setTimeout(function() {' +
                            'document.getElementById("message").style.display = "block";' +
                        '}, 300);' +
                    '}' +
                '</script>' +

                '<label id="message">May the joy be in the hearts</label>'+
                '<button id="show" onmouseup="showMessage();">show message</button>'+

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

    it('is considered in the event loop by zombie even when started at page load', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.style('#message', 'display', 'none', 'starting from none');
            })
            .then(done, function(error) {
                expect(error.message).toEqual(null);
                done();
            });
    });

    it('allows to postpone a treatment', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                return browser.fire('#show', 'mouseup');
            })
            .then(function() {
                expect(browser.document.getElementById('message').style.display).toEqual('block');
            })
            .then(done, function(error) {
                expect(error.message).toEqual(null);
                done();
            });
    });
});

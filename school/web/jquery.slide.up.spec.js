const Browser = require('zombie');
var browser = new Browser();

describe('slideUp jquery animation', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var sendPage = function(response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html>' +
            '<head>' +
                '<script src="/jquery.js"></script>' +
            '</head>' +
            '<body>'+
                '<script>' +
                    'function slideUp() {' +
                        '$("#message").slideUp();' +
                    '}' +
                '</script>' +

                '<div id="message">May the joy be in the hearts</div>'+
                '<button id="go">hide div with slideUp</button>'+

                '<script>' +
                    '$("#go").mouseup(slideUp);' +
                '</script>' +
            '</body>'+
            '</html>';
            response.write(page);
        };

        var sendJQuery = function(response) {
            var fs = require('fs');
            var jqueryLib = require('path').join(__dirname, '/lib/jquery-2.1.3.min.js');
            var content = fs.readFileSync(jqueryLib).toString();
            response.setHeader('Content-Type', 'text/plain');
            response.write(content);
        };

        var handler = function(request, response) {
            if (request.url == '/jquery.js') {
                sendJQuery(response);
            }
            else {
                sendPage(response);
            }
            response.end();
        };

        app = require('http').createServer(handler);
        app.listen(port, done);
    });

    afterEach(function() {
        app.close();
    });

    it('hides the targetted element', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.style('#message', 'display', '');
            })
            .then(function() {
                return browser.fire('#go', 'mouseup')
            })
            .then(function() {
                browser.assert.style('#message', 'display', 'none');
            })
            .then(done);
    });
});

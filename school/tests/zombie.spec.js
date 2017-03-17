const Browser = require('zombie');
var browser = new Browser();

describe('Zombie', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var page = '' +
        '<html>' +
            '<head>' +
                '<script src="jquery-2.1.3.min.js"></script>' +
            '</head>' +
            '<body>'+
                '<div id="greetings"></div>' +
                '<div id="message"></div>' +
                '<script>'+
                    '$( "#message" ).on("this-event", function() {'+
                    '   document.getElementById("message").innerHTML = "I see you";'+
                    '});' +
                    '$( document ).ready(function() {'+
                    '   document.getElementById("greetings").innerHTML = "hello world";'+
                    '   document.getElementById("message").dispatchEvent(new Event("this-event"));'+
                    '});' +
                '</script>'+
            '</body>'+
        '</html>';

        app = require('http').createServer(function(request, response) {
            var url = require('url');
            var parsed = url.parse(request.url, true);
            if (parsed.pathname.endsWith('.js')) {
                var path = require('path').join(__dirname, '../web/lib/' + parsed.pathname);
                var content = require('fs').readFileSync(path).toString();
                response.setHeader('Content-Type', 'application/javascript');
                response.write(content);
            }
            else {
                response.setHeader('Content-Type', 'text/html');
                response.write(page);
            }
            response.end();
        });
        app.listen(port, done);
    });

    afterEach(function() {
        app.close();
    });

    it('can digest jquery', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#greetings', 'hello world');
            })
            .then(done, done);
    });

    it('can spy custom events', function(done) {
        browser.on('event', function(e) {
            if (e.type == 'this-event') {
                done();
            }
        });
        browser.visit('http://localhost:' + port)
        .then(function() {
            browser.assert.text('#message', 'I see you');
        })
        .then(function(){}, done);
    });
});

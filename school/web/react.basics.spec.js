const Browser = require('zombie');
var browser = new Browser();

describe('React HelloWorld', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var sendPage = function(response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html>' +
            '<head>' +
                '<script src="react-15.3.1.min.js"></script>' +
                '<script src="react-dom-15.3.1.min.js"></script>' +
            '</head>' +
            '<body>'+
                '<div id="root"></div>' +
                '<script>'+
                    'ReactDOM.render('+
                    '   React.createElement("h1", { id: "greetings" }, "Hello World!"),'+
                    '   document.getElementById("root")'+
                    ');' +
                '</script>'+
            '</body>'+
            '</html>';
            response.write(page);
        };

        var send = function(file, response) {
            var path = require('path').join(__dirname, '/lib/' + file);
            var content = require('fs').readFileSync(path).toString();
            response.setHeader('Content-Type', 'text/plain');
            response.write(content);
        };

        var handler = function(request, response) {
            var url = require('url');
            var parsed = url.parse(request.url, true);
            if (parsed.pathname.endsWith('.js')) {
                send(parsed.pathname, response);
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

    it('works', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#greetings', 'Hello World!');
            })
            .then(done, done);
    });
});

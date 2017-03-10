const Browser = require('zombie');
var browser = new Browser();

describe('React HelloWorld', function() {

    var app;
    var server;
    var port = 5000;

    beforeEach(function(done) {

        var page = '' +
        '<html>' +
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

        app = require('http').createServer(function(request, response) {
            var url = require('url');
            var parsed = url.parse(request.url, true);
            if (parsed.pathname.endsWith('.js')) {
                var path = require('path').join(__dirname, '/lib/' + parsed.pathname);
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

    it('works', function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#greetings', 'Hello World!');
            })
            .then(done, done);
    });
});

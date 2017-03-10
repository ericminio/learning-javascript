const Browser = require('zombie');
var browser = new Browser();

describe('ECMAScript 6', function() {

    var app;
    var server;
    var port = 5000;
    var script;

    beforeEach(function(done) {

        var page = ''+
        '<html>' +
            '<head>' +
                '<script src="script.js"></script>' +
            '</head>' +
            '<body>'+
                '<div id="root"></div>' +
                '<script>'+
                    'document.getElementById("root").innerHTML = output();'+
                '</script>'+
            '</body>'+
        '</html>';

        var handler = function(request, response) {
            var parsed = require('url').parse(request.url, true);
            if (parsed.pathname == '/script.js') {
                response.setHeader('Content-Type', 'application/javascript');
                response.write(script);
            }
            else {
                response.setHeader('Content-Type', 'text/html');
                response.write(page);
            }
            response.end();
        };

        app = require('http').createServer(handler);
        app.listen(port, done);
    });

    afterEach(function() {
        app.close();
    });

    var yes = function(done) {
        browser.visit('http://localhost:' + port)
            .then(function() {
                browser.assert.text('#root', 'hello');
            })
            .then(done, done);
    };

    it('introduces destructuring', function(sir) {
        script = '' +
            'var output = function() { ' +
            '   let options = { message:"hello", source:"a friend" };' +
            '   let {message, source} = options;' +
            '   return message;' +
            '}';
        yes(sir);
    });
    it('introduces arrow functions', function(sir) {
        script = '' +
            'var output = () => { ' +
            '   return "hello";' +
            '}';
        yes(sir);
    });
});

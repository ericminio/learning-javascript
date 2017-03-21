const Browser = require('zombie');
var browser = new Browser();
var server = require('./lib/server');

describe('React HelloWorld', function() {

    var app;
    var port = 5000;

    beforeEach(function(done) {
        app = server({ index:'' +
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
        '</html>' }).listen(port, done);
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

const Browser = require('zombie');
var browser = new Browser();
let LocalServer = require('../support/local.server');

describe('React HelloWorld', function() {

    var server;    

    describe('with html element', function() {

        var page = `
            <html>
                <head>
                    <script src="/lib/react-15.6.2.min.js"></script>
                    <script src="/lib/react-dom-15.6.2.min.js"></script>
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        ReactDOM.render(
                        React.createElement("h1", { id: "greetings" }, "Hello World!"),
                        document.getElementById("root")
                        );
                    </script>
                </body>
            </html>`;

        beforeEach(function(done) {
            server = new LocalServer(page);
            server.start(done);
        });

        afterEach(function(done) {
            server.stop(done);
        });

        it('works', function(done) {
            browser.visit('http://localhost:' + server.port)
                .then(function() {
                    browser.assert.text('#greetings', 'Hello World!');
                })
                .then(done, done);
        });
    });

    describe('with class', function() {

        var page = `
            <html>
                <head>
                    <script src="/lib/react-15.6.2.min.js"></script>
                    <script src="/lib/react-dom-15.6.2.min.js"></script>
                    <script src="/lib/create-react-class-15.6.2.min.js"></script>
                </head>
                <body>
                    <div id="root"></div>
                    <script>
                        var Greeting = createReactClass({
                            render: function() {
                               return React.createElement("h1", { id: "greetings" }, "Hello World!")
                            }
                        });
                        ReactDOM.render(
                           React.createElement(Greeting, {}, null),
                           document.getElementById("root")
                        );
                    </script>
                </body>
            </html>`;

        beforeEach(function(done) {
            server = new LocalServer(page);
            server.start(done);
        });

        afterEach(function(done) {
            server.stop(done);
        });

        it('works', function(done) {
            browser.visit('http://localhost:' + server.port)
                .then(function() {
                    browser.assert.text('#greetings', 'Hello World!');
                })
                .then(done, done);
        });
    });


});

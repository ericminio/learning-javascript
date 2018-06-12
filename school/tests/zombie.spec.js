const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');

describe('Zombie', function() {

    var server;
    var page = `
        <html>
            <head>
                <script src="/lib/jquery-2.1.3.min.js"></script>
            </head>
            <body>
                <div id="greetings"></div>
                <script>
                    $( document ).ready(function() {
                        document.getElementById("greetings").innerHTML = "hello world";
                        document.dispatchEvent(new Event("this-event"));
                    });
                </script>
            </body>
        </html>
    `;

    beforeEach(function(done) {
        server = new LocalServer(page);
        server.start(done);
    });
    afterEach(function(done) {
        server.stop(done);
    });

    it('can digest jquery', function(done) {
        browser.visit('http://localhost:' + server.port)
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
        browser.visit('http://localhost:' + server.port)
            .then(function(){}, done);
    });
});

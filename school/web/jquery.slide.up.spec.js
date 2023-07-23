const Browser = require('zombie');
var browser = new Browser();
let LocalServer = require('../support/local.server');

describe('slideUp jquery animation', function () {
    var server;
    var page = `
        <html>
            <head>
                <script src="/lib/jquery-2.1.3.min.js"></script>
            </head>
            <body>
                <script>
                    function slideUp() {
                        $("#message").slideUp();
                    }
                </script>

                <div id="message">May the joy be in the hearts</div>
                <button id="go">hide div with slideUp</button>

                <script>
                    $("#go").mouseup(slideUp);
                </script>
            </body>
        </html>`;

    beforeEach(function (done) {
        server = new LocalServer(page);
        server.start(done);
    });

    afterEach(function (done) {
        server.stop(done);
    });

    it('hides the targetted element', function (done) {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                browser.assert.style('#message', 'display', '');
            })
            .then(function () {
                return browser.fire('#go', 'mouseup');
            })
            .then(function () {
                browser.assert.style('#message', 'display', 'none');
            })
            .then(done);
    });
});

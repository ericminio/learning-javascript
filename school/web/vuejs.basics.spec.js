const Browser = require('zombie');
var browser = new Browser();
let LocalServer = require('../support/local.server');

describe('Vuejs Hello World', function() {

    var server;
    var page = `
        <html>
            <head>
                <script src="/lib/vue.js"></script>
            </head>
            <body>
                <div id="app">
                    <label id="greetings">{{ a.message }}</label>
                </div>

                <script>
                    new Vue({
                        el:'#app',
                        data: {
                            a: { message:'Hello World!' }
                        }
                    })
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

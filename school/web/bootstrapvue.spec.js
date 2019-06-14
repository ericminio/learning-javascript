const Browser = require('zombie');
var browser = new Browser();
let LocalServer = require('../support/local.server');

describe('Bootstrap-Vue', function() {

    var server;

    describe('b-table', ()=>{
        var page = `
            <html>
                <head>
                    <script src="/lib/vue.js"></script>
                    <script src="/lib/bootstrap-vue.js"></script>
                </head>
                <body>
                    <div id="list">
                        <b-table :items="items"></b-table>
                    </div>

                    <script>
                        new Vue({
                            el: '#list',
                            data: {
                                items: [
                                    { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                                    { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                                    { age: 89, first_name: 'Geneva', last_name: 'Wilson' }
                                ]
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
                    browser.assert.text('table > tbody > tr:nth-child(2) > td:nth-child(3)', 'Shaw');
                })
                .then(done, done);
        });
    })
});

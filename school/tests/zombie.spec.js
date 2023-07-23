const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');
let expect = require('chai').expect;

describe('Zombie', function () {
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

    beforeEach(function (done) {
        server = new LocalServer(page);
        server.start(done);
    });
    afterEach(function (done) {
        server.stop(done);
    });

    it('can digest jquery', function (done) {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                browser.assert.text('#greetings', 'hello world');
            })
            .then(done, done);
    });
    it('can spy custom events', function (done) {
        browser.on('event', function (e) {
            if (e.type == 'this-event') {
                done();
            }
        });
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {}, done);
    });
    it('can be used to detect the need for cors with non-optional method', (done) => {
        server.stop(() => {
            var thirdParty;
            thirdParty = new LocalServer(function (request, response) {
                response.setHeader('Access-Control-Allow-Origin', '*');
                //response.setHeader('Access-Control-Allow-Methods', 'PUT');
                response.write('answer from third party');
                response.end();
            });
            thirdParty.start(function () {
                var page =
                    `
                    <html>
                        <head>
                            <script src="/lib/jquery-2.1.3.min.js"></script>
                        </head>
                        <body>
                            <label id="greetings"></label>
                            <script>
                                $( document ).ready(function() {
                                    var xhr = new XMLHttpRequest();
                                    xhr.onload = function() {
                                        var label = document.getElementById('greetings');
                                        label.innerHTML = xhr.responseText;
                                    };
                                    xhr.open('PUT', 'http://localhost:` +
                    thirdParty.port +
                    `/message');
                                    xhr.send();
                                });
                            </script>
                        </body>
                    </html>`;
                server = new LocalServer(page);
                server.start(() => {
                    browser.visit('http://localhost:' + server.port).then(
                        () => {},
                        () => {
                            expect(browser.errors[0].toString()).to.equal(
                                'Cannot make request with not-allowed method(PUT): 18'
                            );
                            done();
                        }
                    );
                });
            });
        });
    });
});

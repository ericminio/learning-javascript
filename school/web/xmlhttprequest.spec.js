const Browser = require('zombie');
const browser = new Browser();
let LocalServer = require('../support/local.server');
let expect = require('chai').expect;

describe('XMLHttpRequest', function () {
    var server;
    var thirdParty;

    beforeEach(function (done) {
        thirdParty = new LocalServer(function (request, response) {
            response.setHeader('Access-Control-Allow-Origin', '*');
            if (request.method == 'POST') {
                var body = '';
                request.on('data', (chunk) => {
                    body += chunk;
                });
                request.on('end', () => {
                    response.write('pong: ' + body);
                    response.end();
                });
            } else {
                response.write('pong');
                response.end();
            }
        });
        thirdParty.start(function () {
            var page =
                `
                <html>
                    <head>
                        <script>
                            var goGet = function() {
                                var xhr = new XMLHttpRequest();
                                xhr.onload = function() {
                                    var label = document.getElementById('greetings');
                                    label.innerHTML = xhr.responseText;
                                };
                                xhr.open('GET', 'http://localhost:` +
                thirdParty.port +
                `/message');
                                xhr.send();
                            }
                            var goPost = function() {
                                var xhr = new XMLHttpRequest();
                                xhr.onload = function() {
                                    var label = document.getElementById('greetings');
                                    label.innerHTML = xhr.responseText;
                                };
                                xhr.open('POST', 'http://localhost:` +
                thirdParty.port +
                `/message');
                                xhr.send(document.getElementById('value').value);
                            }
                        </script>
                    </head>
                    <body>
                        <label id="greetings"></label>
                        <button id="goGet" onclick="goGet()">go GET</button>

                        <input id="value" />
                        <button id="goPost" onclick="goPost()">go POST</button>
                    </body>
                </html>`;
            server = new LocalServer(page);
            server.start(done);
        });
    });
    afterEach(function (done) {
        thirdParty.stop(() => {
            server.stop(done);
        });
    });

    it('can GET data', (done) => {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                return browser.click('#goGet');
            })
            .then(function () {
                browser.assert.text('#greetings', 'pong');
            })
            .then(done, done);
    });

    it('can POST data', (done) => {
        browser
            .visit('http://localhost:' + server.port)
            .then(function () {
                return browser.fill('#value', 'hello');
            })
            .then(function () {
                return browser.click('#goPost');
            })
            .then(function () {
                browser.assert.text('#greetings', 'pong: hello');
            })
            .then(done, done);
    });
});

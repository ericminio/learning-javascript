let LocalServer = require('./local.server');
let get = require('request');
let expect = require('chai').expect;
const Browser = require('zombie');
const browser = new Browser();
let request = require('request');

describe('Local Server', () => {
    let server;
    afterEach((done) => {
        if (server) {
            server.stop(done);
        } else {
            done();
        }
    });
    it('exposes the chosen port', (done) => {
        server = new LocalServer((request, response) => {
            response.write('Hello');
            response.end();
        });
        server.start(() => {
            get('http://localhost:' + server.port, (err, response, body) => {
                expect(err).to.equal(null);
                expect(body).to.equal('Hello');
                done();
            });
        });
    });
    it('always uses a fresh port', (done) => {
        server = new LocalServer((request, response) => {
            response.write('Hello');
            response.end();
        });
        server.start(() => {
            let firstPort = server.port;
            server.stop(() => {
                server = new LocalServer((request, response) => {
                    response.write('Hello');
                    response.end();
                });
                server.start(() => {
                    expect(server.port).not.to.equal(firstPort);
                    done();
                });
            });
        });
    });
    it('serves known libs', (done) => {
        var page = `
            <html>
                <head>
                    <title>initial title</title>
                    <script src="/lib/jquery-2.1.3.min.js"></script>
                </head>
                <body>
                    <script>
                        $( document ).ready(function() {
                            document.title = 'modified title';
                        });
                    </script>
                </body>
            </html>                    
        `;
        server = new LocalServer(page);
        server.start(() => {
            browser
                .visit('http://localhost:' + server.port)
                .then(function () {
                    browser.assert.text('title', 'modified title');
                })
                .then(done, done);
        });
    });
    it('leverages regexp', () => {
        var pattern = /^\/lib\/(.*)\.js$/;

        var candidate = '/lib/jquery-2.1.3.min.js';
        expect(pattern.test(candidate)).to.equal(true);
        expect(pattern.exec(candidate)[1]).to.equal('jquery-2.1.3.min');

        candidate = '/';
        expect(pattern.test(candidate)).to.equal(false);
    });

    it('serves local libs', (done) => {
        var page = `
            <html>
                <head>
                    <title>initial title</title>
                    <script src="/lib/jquery-2.1.3.min.js"></script>
                    <script src="/modify-title.js"></script>
                </head>
                <body>
                    <script>
                        $( document ).ready(function() {
                            modifyTitle();
                        });
                    </script>
                </body>
            </html>                    
        `;
        server = new LocalServer({
            '/': page,
            '/modify-title.js': `function modifyTitle() { document.title='modified title'; } `,
        });
        server.start(() => {
            browser
                .visit('http://localhost:' + server.port)
                .then(function () {
                    browser.assert.text('title', 'modified title');
                })
                .then(done, done);
        });
    });

    it('serves json', (done) => {
        server = new LocalServer({
            json: {
                '/ping': { message: 'pong' },
            },
        });
        server.start(() => {
            request.get(
                'http://localhost:' + server.port + '/ping',
                (err, response, body) => {
                    expect(JSON.parse(body)).to.deep.equal({ message: 'pong' });
                    expect(response.headers['content-type']).to.equal(
                        'application/json'
                    );
                    expect(response.headers['content-length']).to.equal('18');
                    done();
                }
            );
        });
    });

    it('serves not-found when setup with an object', (done) => {
        server = new LocalServer({});
        server.start(() => {
            request.get(
                'http://localhost:' + server.port + '/ping',
                (err, response, body) => {
                    expect(body).to.equal('not found');
                    expect(response.headers['content-type']).to.equal(
                        'text/plain'
                    );
                    expect(response.statusCode).to.equal(404);
                    done();
                }
            );
        });
    });
});

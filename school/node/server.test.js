const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');
const { Server } = require('./server');

describe('server', () => {
    describe('port', () => {
        let server;
        let baseUrl;
        let secondServer;
        beforeEach(async () => {
            server = new Server();
            const port = await server.start();
            baseUrl = `http://localhost:${port}`;
        });
        afterEach(async () => {
            if (secondServer && secondServer.started) {
                await secondServer.stop();
            }
            await server.stop();
        });

        it('defaults to 5001', async () => {
            assert.equal(baseUrl, 'http://localhost:5001');
        });

        it('is the next available after default port', async () => {
            secondServer = new Server();
            const secondPort = await secondServer.start();
            let answer = await fetch(`http://localhost:${secondPort}`);
            let content = await answer.text();

            assert.equal(content, 'NOT IMPLEMENTED');
            assert.equal(secondPort, 5002);
        });

        it('can be forced', async () => {
            secondServer = new Server(5005, (_, response) => {
                const answer = 'port forced';
                response.writeHead(200, {
                    'content-type': 'plain/text',
                    'content-length': answer.length,
                });
                response.end(answer);
            });
            await secondServer.start();
            let answer = await fetch(`http://localhost:5005`);
            let content = await answer.text();

            assert.equal(content, 'port forced');
        });

        it('welcomes default handler', async () => {
            secondServer = new Server(5005);
            await secondServer.start();
            let answer = await fetch(`http://localhost:5005`);

            assert.equal(answer.status, 501);
        });
    });

    describe('the promise way', () => {
        let server;
        let baseUrl;
        beforeEach(async () => {
            server = new Server();
            const port = await server.start();
            baseUrl = `http://localhost:${port}`;
        });

        afterEach(async () => {
            await server.stop();
        });

        it('defaults to 501', async () => {
            let answer = await fetch(`${baseUrl}`);

            assert.equal(answer.status, 501);
        });

        it('resists two calls of start', async () => {
            await server.start();
            let answer = await fetch(`${baseUrl}`);

            assert.equal(answer.status, 501);
        });

        it('accepts handler', async () => {
            await server.stop();
            server = new Server((incoming, response) => {
                const answer = `${incoming.method} ${incoming.url}`;
                response.writeHead(200, {
                    'content-type': 'plain/text',
                    'content-length': answer.length,
                });
                response.write(answer);
                response.end();
            });
            const port = await server.start();
            let answer = await fetch(`http://localhost:${port}/ping`);
            let content = await answer.text();

            assert.equal(content, 'GET /ping');
        });
    });

    describe('the callback way', () => {
        let server;
        let baseUrl;
        beforeEach(
            () =>
                new Promise((resolve) => {
                    server = new Server();
                    server.start((port) => {
                        baseUrl = `http://localhost:${port}`;
                        resolve();
                    });
                })
        );

        afterEach(
            () =>
                new Promise((resolve) => {
                    server.stop(resolve);
                })
        );

        describe('default handler', () => {
            it('is 501', async () => {
                let answer = await fetch(`${baseUrl}`);

                assert.equal(answer.status, 501);
            });
            it('provides body', async () => {
                let answer = await fetch(`${baseUrl}`);
                let content = await answer.text();

                assert.equal(content, 'NOT IMPLEMENTED');
            });
        });

        it('resists two calls of start', (_, done) => {
            server.start(() => {
                fetch(`${baseUrl}/`)
                    .then((response) => {
                        assert.equal(response.status, 501);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('handler injection', () => {
            it('replaces default handler', async () => {
                server.use((incoming, response) => {
                    const answer = `${incoming.method} ${incoming.url}`;
                    response.writeHead(200, {
                        'content-type': 'plain/text',
                        'content-length': answer.length,
                    });
                    response.write(answer);
                    response.end();
                });
                let answer = await fetch(`${baseUrl}/ping`);
                let content = await answer.text();

                assert.equal(content, 'GET /ping');
            });
        });
    });
});

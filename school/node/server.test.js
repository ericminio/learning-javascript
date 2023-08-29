const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');
const { Server } = require('./server');

describe('server', () => {
    let server;
    let baseUrl;

    describe('port', () => {
        let secondServer;
        beforeEach(async () => {
            server = new Server();
            port = await server.start();
            baseUrl = `http://localhost:${port}`;
        });
        afterEach(async () => {
            if (secondServer && secondServer.started) {
                await secondServer.stop();
            }
        });

        afterEach(async () => {
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
    });

    describe('the promise way', () => {
        beforeEach(async () => {
            server = new Server();
            port = await server.start();
            baseUrl = `http://localhost:${port}`;
        });

        afterEach(async () => {
            await server.stop();
        });

        it('defaults to 501', async () => {
            let answer = await fetch(`${baseUrl}`);

            assert.equal(answer.status, 501);
        });
    });

    describe('the callback way', () => {
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

        describe('handler injection', () => {
            it('replaces default handler', async (t) => {
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

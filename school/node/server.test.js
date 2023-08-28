const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');
const { Server } = require('./server');

describe('server', () => {
    let server;
    let port = 5001;
    let baseUrl;

    beforeEach(
        () =>
            new Promise((resolve) => {
                server = new Server(port);
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

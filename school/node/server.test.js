const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');
const { Server } = require('./server');

describe('server', async () => {
    let server;
    let port = 5001;
    let baseUrl;

    beforeEach(() => {
        return new Promise((resolve) => {
            server = new Server(port);
            server.start((port) => {
                baseUrl = `http://localhost:${port}`;
                resolve();
            });
        });
    });

    afterEach(async () => {
        await new Promise((resolve) => {
            server.stop(resolve);
        });
    });

    describe('default handler', async () => {
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
});

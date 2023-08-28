const { test, describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');
const { Server } = require('./server');

test('server', async (t) => {
    let server;
    let port = 5001;
    let baseUrl;

    t.beforeEach(() => {
        return new Promise((resolve) => {
            server = new Server(port);
            server.start((port) => {
                baseUrl = `http://localhost:${port}`;
                resolve();
            });
        });
    });

    t.afterEach(async () => {
        await new Promise((resolve) => {
            server.stop(resolve);
        });
    });

    await t.test('default handler', async (t) => {
        await t.test('is 501', async () => {
            let answer = await fetch(`${baseUrl}`);

            assert.equal(answer.status, 501);
        });
        await t.test('discloses 501 body', async () => {
            let answer = await fetch(`${baseUrl}`);
            let content = await answer.text();

            assert.equal(content, 'NOT IMPLEMENTED');
        });
    });
});

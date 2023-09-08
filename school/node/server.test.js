const { describe, it, beforeEach } = require('node:test');
const { strict: assert } = require('node:assert');
const http = require('http');

describe('Http Server', () => {
    let server;

    beforeEach(() => {
        server = http.createServer();
    });

    describe('default listening event listener', () => {
        it('exists', () => {
            assert.ok(server.listenerCount('listening') > 0);
        });

        it('has something to do with connections check', () => {
            const listeners = server.listeners('listening');
            const setupConnectionsTracking = listeners[0];
            const code = setupConnectionsTracking.toString();

            assert.match(code, /setupConnectionsTracking/);
        });
    });

    it('does not come with default error event listener', () => {
        assert.ok(server.listenerCount('error') === 0);
    });
});

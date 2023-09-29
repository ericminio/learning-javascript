const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');
const { Readable } = require('node:stream');

describe('Readable Stream', () => {
    it('can be built from array', async () => {
        const incoming = [3, 5, 7];
        const stream = Readable.from(incoming);
        const received = await new Promise((resolve) => {
            const buffer = [];
            stream.on('data', (chunk) => {
                buffer.push(chunk);
            });
            stream.on('end', () => {
                resolve(buffer);
            });
        });
        assert.deepStrictEqual(received, [3, 5, 7]);
    });
});

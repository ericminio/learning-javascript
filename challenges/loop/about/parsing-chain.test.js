const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { parseChain } = require('../lib/parseChain.js');

describe('parsing chain', () => {
    it('works with one ring', () => {
        const incoming = `
        .-.
        `;
        const chain = parseChain(incoming);

        assert.deepStrictEqual(chain, {
            '1x0': {
                x: 1,
                y: 0,
                value: '-',
                next: undefined,
                previous: undefined,
            },
        });
    });
});

const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { parsePositions } = require('../lib/parsePositions.js');

describe('parsing positions', () => {
    it('is staright forward', () => {
        const incoming = `
        .ab.
        `;
        const dots = parsePositions(incoming);

        assert.deepStrictEqual(dots, {
            '1x0': { x: 1, y: 0, value: 'a' },
            '2x0': { x: 2, y: 0, value: 'b' },
        });
    });
});

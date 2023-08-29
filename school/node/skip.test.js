const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');

describe('skipping test', () => {
    let spy = 0;

    it.skip('tries to leak', () => {
        spy += 1;
    });

    it('does not leak', () => {
        spy += 1;
        assert.equal(spy, 1);
    });
});

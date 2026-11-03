const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

describe('conditional', () => {
    it('is branching the code', () => {
        const spy = [1];

        if (true) {
            spy.push(2);
        }

        assert.deepStrictEqual(spy, [1, 2]);
    });

    it('can also assign', () => {
        const spy = [1];
        if ((next = 2)) {
            spy.push(next);
        }

        assert.deepStrictEqual(spy, [1, 2]);
    });

    it('needs truthiness on assignment to actually branch', () => {
        const spy = [1];
        if ((yes = null)) {
            spy.push(2);
        }

        assert.deepStrictEqual(spy, [1]);
    });
});

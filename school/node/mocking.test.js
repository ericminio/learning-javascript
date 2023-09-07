const { describe, it, beforeEach, afterEach } = require('node:test');
const { strict: assert } = require('node:assert');

const sut = {
    add: (a, b) => a + b,
};

describe('mocking', () => {
    it('allows call assertion', (context) => {
        context.mock.method(sut, 'add');
        sut.add(1, 2);

        assert.strictEqual(sut.add.mock.calls.length, 1);
        assert.deepStrictEqual(sut.add.mock.calls[0].arguments, [1, 2]);
    });
    it('offers implementation stubbing', (context) => {
        context.mock.method(sut, 'add');
        sut.add.mock.mockImplementation(() => 42);

        assert.equal(sut.add(4, 2), 42);
    });
});

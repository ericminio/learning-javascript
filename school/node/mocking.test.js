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

    describe('function stubbing', () => {
        it('is available', (context) => {
            const mocked = context.mock.fn(sut.add, () => 42);

            assert.equal(mocked(4, 2), 42);
        });
        it('can be set for a number of calls', (context) => {
            const mocked = context.mock.fn(sut.add, () => 42, { times: 2 });

            assert.equal(mocked(4, 2), 42);
            assert.equal(mocked(4, 2), 42);
            assert.equal(mocked(4, 2), 6);
        });
        it('can be postponed with a little help', (context) => {
            context.callIndex = 0;
            const mocked = context.mock.fn(sut.add, (a, b) => {
                context.callIndex += 1;
                return context.callIndex <= 2 ? sut.add(a, b) : 42;
            });

            assert.equal(mocked(4, 2), 6);
            assert.equal(mocked(4, 2), 6);
            assert.equal(mocked(4, 2), 42);
        });
    });
});

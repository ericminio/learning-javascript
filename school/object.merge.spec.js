var expect = require('chai').expect;

describe('Object assign', function () {
    it('can be used to merge two objects', function () {
        var first = { one: 'one', two: 'two' };
        var second = { three: 'three' };
        Object.assign(first, second);

        expect(first).to.deep.equal({ one: 'one', two: 'two', three: 'three' });
    });

    it('keeps source untouched', function () {
        var first = { one: 'one', two: 'two' };
        var second = { three: 'three' };
        Object.assign(first, second);

        expect(second).to.deep.equal({ three: 'three' });
    });

    it('overrides existing field', function () {
        var first = { one: 'one', two: 'two' };
        var second = { two: '***' };
        Object.assign(first, second);

        expect(first).to.deep.equal({ one: 'one', two: '***' });
    });
});

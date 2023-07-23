var expect = require('chai').expect;

describe('Object copy', function () {
    it('has its own syntax', function () {
        var first = { one: 'one', two: 'two' };
        var second = { ...first };
        first.one = '1';

        expect(second.one).to.equal('one');
    });

    it('has a syntax to include field overwrite', function () {
        var first = { one: 'one', two: 'two' };
        var second = { ...first, two: '2' };

        expect(second).to.deep.equal({ one: 'one', two: '2' });
    });
});

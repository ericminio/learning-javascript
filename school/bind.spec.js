var expect = require('chai').expect;

describe('Bind', function () {
    it('offers a way to imposterize this', function () {
        var bound;
        var subject = {};
        (function () {
            bound = this;
        }).bind(subject)();

        expect(bound).to.equal(subject);
    });
});

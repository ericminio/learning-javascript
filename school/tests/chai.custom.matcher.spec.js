var chai = require('chai')
    , expect = chai.expect;
var matcher = function(chai, utils) {
    var Assertion = chai.Assertion;
    Assertion.addMethod('matchThis', function(check) {
        var sut = this._obj;
        this.assert(
            check(sut)
            , JSON.stringify(sut) + ' does not match'
            , JSON.stringify(sut) + ' matches'
        );
    });
};
chai.use(matcher);

describe('Chai', function() {

    var constraint = function(sut) { return sut.value == 42; };

    it('lets you define you own matcher', function() {
        try {
            expect({ value:42 }).to.matchThis(constraint);
            expect({ value:41 }).to.matchThis(constraint);
        }
        catch (error) {
            expect(error.message).to.equal('{"value":41} does not match');
        }
    });
    it('lets you chain it with not.', function() {
        try {
            expect({ value:41 }).not.to.matchThis(constraint);
            expect({ value:42 }).not.to.matchThis(constraint);
        }
        catch (error) {
            expect(error.message).to.equal('{"value":42} matches');
        }
    });
});

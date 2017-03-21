var expect = require('chai').expect;

var inspect = function(options) {
    var caller = inspect.caller;
    return {
        method: caller.name,
        arguments: caller.arguments
    };
};

describe('caller', function() {

    var calling;
    var thisMethod = function(options) {
        calling = inspect();
    };
    beforeEach(function() {
        thisMethod({value:42});
    });
    it('exposes calling method', function(){
        expect(calling.method).to.equal('thisMethod');
    });
    it('exposes calling method parameters values', function(){
        expect(calling.arguments[0]).to.deep.equal({value:42});
    });
});

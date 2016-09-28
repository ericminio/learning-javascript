var expect = require('chai').expect;
var Mocha = require('mocha');

describe('Mocha reporter fail listener', function() {

    var IKeepFailingInfo = function(runner) {
        runner.on('fail', function(test, err) {
            IKeepFailingInfo.failing = test;
            IKeepFailingInfo.error = err;
        });
    };

    beforeEach(function(exit) {
        var mocha = new Mocha({reporter: IKeepFailingInfo});
        var failingTest = new Mocha.Test('failing test', function(){
            throw new Error('expected');
        });
        mocha.suite.addTest(failingTest);
        mocha.run(function(failures){ exit(); });
    });

    it('receives the failing test', function() {
        expect(IKeepFailingInfo.failing.title).to.equal('failing test');
    });

    it('receives the actual error', function() {
        expect(IKeepFailingInfo.error.message).to.equal('expected');
    });

});

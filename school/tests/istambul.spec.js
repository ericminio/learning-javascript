var expect = require('chai').expect;
var istanbul = require('istanbul');

describe('Istanbul', function() {

    it('detects function coverage', function() {
        var instrumenter = new istanbul.Instrumenter();
        var instrumented = instrumenter.instrumentSync('' +
            'function meaningOfLife() { \n' +
            '   return 42; \n' +
            '}');
        (new Function( instrumented + 'return meaningOfLife();'))();
        var report = (Function('return this'))()['__coverage__'];

        expect(report[Object.keys(report)[0]].f).to.deep.equal({ '1':1 });
    });
});

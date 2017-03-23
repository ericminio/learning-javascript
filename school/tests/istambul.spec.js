var expect = require('chai').expect;
var istanbul = require('istanbul');

describe('Istanbul', function() {

    var meaningOfLife;

    beforeEach(function() {
        var code = '' +
            'function willHaveFunctionId1() { \n' +
            '} \n' +
            'function meaningOfLife(timeHasCome) { \n' +
            '    if (timeHasCome) { \n' +
            '       return 42; \n' +
            '    }\n' +
            '    else { \n' +
            '       return "please wait..."; \n' +
            '    }\n' +
            '} \n' +
            'function willHaveFunctionId3() { \n' +
            '} \n' +
            '';
        meaningOfLife = instrumented('meaningOfLife', code);
    });
    it('detects function coverage as expected', function() {
        meaningOfLife();

        expect(coverageData().f).to.deep.equal({ '1':0, '2':1, '3':0 });
    });
    it('detects branch coverage as expected', function() {
        meaningOfLife(true);

        expect(coverageData().b).to.deep.equal({ '1': [1, 0] });
    });
    it('defaults function declaration with 1 in line coverage', function() {
        expect(coverageData().s).to.deep.equal({ '1':1, '2':1, '3':0, '4':0, '5':0, '6':1 });
    });
    it('detects statement coverage as expected', function() {
        meaningOfLife(false);
        meaningOfLife(false);

        expect(coverageData().s).to.deep.equal({ '1':1, '2':1, '3':2, '4':0, '5':2, '6':1 });
    });

    var instrumented = function(api, code) {
        clearCoverageData();
        var instrumenter = new istanbul.Instrumenter();
        var instrumented = instrumenter.instrumentSync(code);
        return (new Function( instrumented + 'return '+ api +';'))();
    };
    var coverageData = function() {
        var report = global()['__coverage__'];
        return report[Object.keys(report)[0]];
    };
    var clearCoverageData = function() {
        global()['__coverage__'] = {};
    };
    var global = function() {
        return (Function('return this;'))();
    };
});

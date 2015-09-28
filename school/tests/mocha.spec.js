var expect = require('chai').expect;

describe('Mocha', function () {

    it('can assert', function () {
        expect(1 + 1).to.equal(2);
    });
    it('can require node core modules', function () {
        expect(require('http')).not.to.equal(undefined);
        expect(require('fs')).not.to.equal(undefined);
    });
    it('can require sinon', function() {
        expect(require('sinon')).not.to.equal(undefined);
    });

    describe('Spying with sinon', function() {

        var sinon = require('sinon');

        it('offers spying on the method of an object', function() {
            var sut = { api: function(dependency) { dependency.doThat('please'); }};
            var collaborator = { doThat: function() {} };
            var spy = sinon.spy(collaborator, 'doThat');
            sut.api(collaborator);

            expect(spy.calledWith('please')).to.equal(true);
        });

        it('gives better assertion errors with sinon-chai', function() {
            require('chai').use(require('sinon-chai'));
            var sut = { api: function(dependency) { dependency.doThat('please'); }};
            var collaborator = { doThat: sinon.spy() };
            sut.api(collaborator);

            expect(collaborator.doThat).to.have.been.calledWith('please');
        });
    });
});

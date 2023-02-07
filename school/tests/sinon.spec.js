var { expect } = require('chai');
var sinon = require('sinon');

describe.only('Sinon', function () {

    it('offers spying on the method of an object', function () {
        var sut = { api: function (dependency) { dependency.doThat('please'); } };
        var collaborator = { doThat: function () { } };
        var spy = sinon.spy(collaborator, 'doThat');
        sut.api(collaborator);

        expect(spy.calledWith('please')).to.equal(true);
    });

    it('gives better assertion errors with sinon-chai', function () {
        require('chai').use(require('sinon-chai'));
        var sut = { api: function (dependency) { dependency.doThat('please'); } };
        var collaborator = { doThat: sinon.spy() };
        sut.api(collaborator);

        expect(collaborator.doThat).to.have.been.calledWith('please');
    });
});

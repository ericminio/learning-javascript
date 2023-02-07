var { expect } = require('chai');
var sinon = require('sinon');

describe.only('Sinon', function () {

    describe('Spying with sinon', function () {



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

    describe('with promises', () => {

        it('can expect resolution', () => {
            return Promise.resolve(42)
                .then((value) => { expect(value).to.equal(42); });
        });
        it('can expect rejection', () => {
            return Promise.reject(66)
                .catch((value) => { expect(value).to.equal(66); });
        });
    });

    describe('with chai-as-promised', () => {

        let chai = require('chai');
        var chaiAsPromised = require("chai-as-promised");
        chai.use(chaiAsPromised);

        it('can expect resolution', () => {
            return expect(Promise.resolve(42))
                .to.eventually.equal(42);
        });
        it('can expect resolved object', () => {
            return expect(Promise.resolve({ value: 42 }))
                .to.eventually.deep.equal({ value: 42 });
        });
        it('can expect resolved object field', () => {
            return expect(Promise.resolve({ value: 42 }))
                .to.eventually.have.property('value', 42);
        });

        it('can expect rejection', () => {
            return expect(Promise.reject(66))
                .to.be.rejected.then(error => { expect(error).to.equal(66); });
        });
        it('can expect rejected object field', () => {
            return expect(Promise.reject({ value: 66 }))
                .to.eventually.be.rejected.and.have.property('value', 66);
        });
        it('can expect rejected object', () => {
            return expect(Promise.reject({ value: 66 }))
                .to.be.rejected.then(error => { expect(error).to.deep.equal({ value: 66 }); });
        });
    });
});

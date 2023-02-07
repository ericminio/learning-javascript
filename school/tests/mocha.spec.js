var { expect } = require('chai');

describe.only('Mocha', function () {

    it('can assert', function () {
        expect(1 + 1).to.equal(2);
    });
    it('can require node core modules', function () {
        expect(require('http')).not.to.equal(undefined);
        expect(require('fs')).not.to.equal(undefined);
    });

    it('exposes test name in this.ctx.test.title with arrow function', () => {
        expect(this.ctx.test.title).to.equal('exposes test name in this.ctx.test.title with arrow function');
    });
    it('exposes test name in this.test.title with regular function', function () {
        expect(this.test.title).to.equal('exposes test name in this.test.title with regular function');
    });
    describe(`
        multiline
        context
        with regular function callback
        `, function () {

        let title;
        beforeEach(() => {
            title = this.title
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .join(' ');
        });

        it('is exposed in this.title', () => {
            expect(title).to.equal('multiline context with regular function callback');
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

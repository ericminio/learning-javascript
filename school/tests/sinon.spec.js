var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

describe('Sinon', function () {

    it('offers spying on the method of an object', function () {
        var sut = { api: function (dependency) { dependency.doThat('please'); } };
        var collaborator = { doThat: function () { } };
        var spy = sinon.spy(collaborator, 'doThat');
        sut.api(collaborator);

        expect(spy.calledWith('please')).to.equal(true);
    });

    it('gives better assertion errors with sinon-chai', function () {
        var sut = { api: function (dependency) { dependency.doThat('please'); } };
        var collaborator = { doThat: sinon.spy() };
        sut.api(collaborator);

        expect(collaborator.doThat).to.have.been.calledWith('please');
    });

    it('can verify a non-event', function () {
        var sut = {
            api: (dependency) => { dependency.doThat('please'); },
            nop: () => { }
        };
        var collaborator = { doThat: sinon.spy() };
        sut.nop();

        expect(collaborator.doThat).not.to.have.been.called;
    });

    describe('stubbing', () => {

        let fetch;
        beforeEach(() => {
            fetch = sinon.stub();
        });

        it('offers pre-setting a returned value', () => {
            fetch.returns({ data: { value: 42 } });
            const adapter = { getData: fetch => fetch('parameter-not-covered') };
            const answer = adapter.getData(fetch);

            expect(answer.data.value).to.equal(42);
        });

        it('can lead to tough-to-troubleshoot failing tests when stubbing and mocking are mixed', () => {
            fetch.withArgs('666').returns({ data: { value: 42 } });
            const adapter = { getData: fetch => fetch('parameter-wants-coverage') };
            try {
                const answer = adapter.getData(fetch);
                answer.data.value;
                expect('should fail').to.equal('but no');
            }
            catch (error) {
                expect(error.toString()).to.equal(`TypeError: Cannot read property 'data' of undefined`);
            }
        });

        it('welcomes mocking verification as a separate intention', () => {
            const adapter = { getData: fetch => fetch('I-see-you') };
            adapter.getData(fetch);

            expect(fetch).to.have.been.calledWith('I-see-you');
        });
    });

    describe.only('emerging pyramid empowerement', () => {
        let fetch;
        const a = { doThat: (b, fetch) => b.doThis(fetch) };
        const b = { doThis: fetch => fetch('key') };
        beforeEach(() => {
            fetch = sinon.stub();
        });

        it('takes an a->b sut', () => {
            fetch.returns(42);

            expect(a.doThat(b, fetch)).to.equal(42);
        });
    });
});

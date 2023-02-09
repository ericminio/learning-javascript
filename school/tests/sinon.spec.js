var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

describe.only('Sinon', function () {

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

        it('primarily stubs the returned value', () => {
            const adapter = { getData: fetch => { return fetch('not-covered'); } };
            const fetch = sinon.stub().returns({ data: { value: 42 } });
            const answer = adapter.getData(fetch);

            expect(answer.data.value).to.equal(42);
        });

        it('can hide separate intentions of stubbing and mocking', () => {
            const fetch = sinon.stub();
            fetch.withArgs('oops').returns({ data: { value: 42 } });
            const adapter = { getData: fetch => { return fetch('want-coverage'); } };
            try {
                const answer = adapter.getData(fetch);
                answer.data.value;
                expect('should fail').to.equal('but no');
            }
            catch (error) {
                expect(error.toString()).to.equal(`TypeError: Cannot read property 'data' of undefined`)
            }
        });

        it('also provides mock verification', () => {
            const adapter = { getData: fetch => { return fetch('I-see-you'); } };
            const fetch = sinon.stub();
            adapter.getData(fetch);

            expect(fetch).to.have.been.calledWith('I-see-you');
        });
    })
});

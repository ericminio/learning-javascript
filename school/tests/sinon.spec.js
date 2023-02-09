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

        it('can hide separate intentions', () => {
            const stub = sinon.stub();
            stub.withArgs('oops').returns({ data: { value: 42 } });
            const sut = { api: (dependency) => { return dependency.doThat('please'); } };
            try {
                const answer = sut.api({ doThat: stub });
                const value = answer.data.value;
                expect('should fail').to.equal('but no');
            }
            catch (error) {
                console.log({ error })
                // expect(error).to.equal(`Cannot read property 'data' of undefined`)
            }
        });

        it('primarily stubs the returned value', () => {
            const sut = { api: (dependency) => { return dependency.doThat('please'); } };
            const collaborator = { doThat: sinon.stub().returns({ data: { value: 42 } }) };
            const answer = sut.api(collaborator);
            const value = answer.data.value;

            expect(value).to.equal(42);
        });

        it('also provides mocks verification', () => {
            const sut = { api: (dependency) => { return dependency.doThat('please'); } };
            const collaborator = { doThat: sinon.stub() }
            sut.api(collaborator);

            expect(collaborator.doThat).to.have.been.calledWith('please');
        });
    })
});

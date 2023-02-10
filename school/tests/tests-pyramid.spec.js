var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

const service = { doThat: (b, fetch) => b.doThis(fetch) };
const b = { doThis: fetch => fetch('key') };

describe.only('Tests', () => {

    let fetch;
    beforeEach(() => {
        fetch = sinon.stub();
    });

    it('can be external and describe behaviors observable from outside', () => {
        fetch.returns(42);

        expect(service.doThat(b, fetch)).to.equal(42);
    });

    it('can be internal and describe internal details', () => {
        b.doThis(fetch);

        expect(fetch).to.have.been.calledWith('key');
    });
});
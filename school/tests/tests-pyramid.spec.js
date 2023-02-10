var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

const a = { doThat: (b, fetch) => b.doThis(fetch) };
const b = { doThis: fetch => fetch('key') };

describe.only('Tests', () => {

    let fetch;
    beforeEach(() => {
        fetch = sinon.stub();
    });

    it('can whether focus on behaviors observable from outside', () => {
        fetch.returns(42);

        expect(a.doThat(b, fetch)).to.equal(42);
    });

    it('can have internal tests', () => {
        b.doThis(fetch);

        expect(fetch).to.have.been.calledWith('key');
    });
});
var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

describe.only('Tests', () => {

    beforeEach(() => {
        fetch = sinon.stub();
    });

    it('can be external and describe behaviors observable from outside', () => {
        fetch.returns(42);

        expect(new Service().doThat(new Adapter(fetch))).to.equal(42);
    });

    it('can be internal and describe internal details', () => {
        new Adapter(fetch).doThis();

        expect(fetch).to.have.been.calledWith('key');
    });
});

let fetch;
class Service {
    doThat(port) {
        return port.doThis();
    }
};
class Adapter {
    constructor(fetch) {
        this.fetch = fetch;
    }
    doThis() {
        return fetch('key');
    }
};
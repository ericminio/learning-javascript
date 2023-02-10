var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

describe.only('Tests', () => {

    beforeEach(() => {
        fetch = sinon.stub();
    });

    it('can be external and focus on the big picture', () => {
        fetch.returns(42);

        expect(new Service().doThat()).to.equal(42);
    });

    it('can be internal and describe internal details', () => {
        new Adapter().doThis();

        expect(fetch).to.have.been.calledWith('key');
    });

    it('can be a little of both at the cost of clear intention', () => {
        fetch.withArgs('key').returns(42);

        expect(new Service().doThat()).to.equal(42);
    });
});

let fetch;
class Service {
    constructor() {
        this.port = new Adapter();
    }
    doThat() {
        return this.port.doThis();
    }
};
class Adapter {
    doThis() {
        return fetch('key');
    }
};
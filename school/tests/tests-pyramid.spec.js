var { expect } = require('chai');
var sinon = require('sinon');
require('chai').use(require('sinon-chai'));

describe.only('Tests', () => {

    beforeEach(() => {
        fetch = sinon.stub();
    });

    it('can be external and focus on feedback', () => {
        fetch.returns(42);

        expect(new Component().doThat()).to.equal(42);
    });

    it('can be external and focus on notifications', () => {
        fetch.returns(42);
        new Component().doThat()

        expect(fetch).to.have.been.calledWith('key');
    });

    it('can be internal', () => {
        new Service().doThis();

        expect(fetch).to.have.been.calledWith('key');
    });

    it('can be both maybe at the cost of a clear intention', () => {
        fetch.withArgs('key').returns(42);

        expect(new Component().doThat()).to.equal(42);
    });
});

let fetch;

class Component {
    constructor() {
        this.service = new Service();
    }
    doThat() {
        return this.service.doThis();
    }
};
class Service {
    doThis() {
        return fetch('key');
    }
};
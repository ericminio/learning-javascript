var { expect } = require('chai');

const verify = (sut) => {
    describe('expectation', () => {
        it('is met', () => {
            expect(sut()).to.equal(42);
        });
    });
};

const firstSut = () => 42;
const secondSut = () => 84 / 2;

describe('SUT injection', function () {
    verify(firstSut);
    verify(secondSut);
});

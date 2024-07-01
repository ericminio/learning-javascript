const { expect } = require('chai');

describe('prime factors', () => {
    it('starts simple', () => {
        expect(primeFactorsOf(2)).to.deep.equal([2]);
    });
    it('can compute power of 2', () => {
        expect(primeFactorsOf(16)).to.deep.equal([2, 2, 2, 2]);
    });
    it('can compute power of 3', () => {
        expect(primeFactorsOf(9)).to.deep.equal([3, 3]);
    });
    it('can compute any number', () => {
        expect(primeFactorsOf(1492)).to.deep.equal([2, 2, 373]);
    });
});

const primeFactorsOf = (number) => {
    let factors = [];
    let candidate = 2;

    while (number > 1) {
        while (number % candidate == 0) {
            factors.push(candidate);
            number /= candidate;
        }
        candidate++;
    }

    return factors;
};

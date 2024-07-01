var expect = require('chai').expect;

Number.prototype.day = () => 86400 * 1000;
Number.prototype.days = function () {
    return (1).day() * this.valueOf();
};
Number.prototype.ago = function () {
    const now = new Date();
    const date = new Date(now.getTime() - this.valueOf());
    date.nowWas = now;
    return date;
};

describe('Dates', function () {
    it('exposes what now was at time of calculation', () => {
        const yesterday = (1).day().ago();

        expect(yesterday.getTime()).to.equal(
            new Date(yesterday.nowWas.getTime() - 86400 * 1000).getTime()
        );
    });

    it('exposes 2.days.ago', () => {
        const yesterday = (2).days().ago();

        expect(yesterday.getTime()).to.equal(
            new Date(yesterday.nowWas.getTime() - 2 * 86400 * 1000).getTime()
        );
    });
});

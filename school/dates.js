var expect = require('chai').expect;

Number.prototype.hour = () => 60 * 60 * 1000;
Number.prototype.day = () => 24 * (1).hour();
Number.prototype.days = function () {
    return (1).day() * this.valueOf();
};
Number.prototype.hours = function () {
    return (1).hour() * this.valueOf();
};
Number.prototype.ago = function (ref) {
    const now = ref || new Date();
    const date = new Date(now.getTime() - this.valueOf());
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();

    const before = new Date(year, month, day, hours + 1);
    before.nowWas = now;
    return before;
};

describe('Dates', function () {
    it('returns top of the clock', () => {
        const before = (3).days().ago();

        expect(before.toISOString()).to.match(/:00:00.000Z$/);
    });

    it('rounds up to the next hour', () => {
        const now = new Date('2021-10-19T06:03:00.000Z');
        const before = (3).days().ago(now);

        expect(before.toISOString()).to.equal('2021-10-16T07:00:00.000Z');
    });

    it('exposes what now was at time of calculation', () => {
        const yesterday = (1).day().ago();
        const now = yesterday.nowWas;
        const diff =
            (now.getTime() - yesterday.getTime()) / (1000 * 60 * 60 * 24);

        expect(diff).to.be.lessThanOrEqual(1);
    });

    it('offers hour granularity', () => {
        const now = new Date('2021-10-19T06:03:00.000Z');
        const before = (3).hours().ago(now);

        expect(before.toISOString()).to.equal('2021-10-19T04:00:00.000Z');
    });
});

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
    const before = new Date(now.getTime() - this.valueOf());
    before.nowWas = now;
    return before;
};
Number.prototype.midnightAgo = function (ref) {
    const now = ref || new Date();
    const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0
    );

    return new Date(midnight.getTime() - (this.valueOf() - 1).days());
};

const rstamp = (date) => {
    if (date.getTime() > (1).midnightAgo().getTime()) {
        return 'today';
    }
    if (date.getTime() > (2).midnightAgo().getTime()) {
        return 'yesterday';
    }
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const n = diff / (1).day();

    return `${n} days ago`;
};

describe('Dates', function () {
    it('exposes what now was at time of calculation', () => {
        const yesterday = (1).day().ago();
        const now = yesterday.nowWas;
        const diff =
            (now.getTime() - yesterday.getTime()) / (1000 * 60 * 60 * 24);

        expect(diff).to.be.lessThanOrEqual(1);
    });

    it('offers hour granularity', () => {
        const now = new Date('2021-10-19T06:03:00.000Z');
        const before = (2).hours().ago(now);

        expect(before.toISOString()).to.equal('2021-10-19T04:03:00.000Z');
    });
});

describe('midnights', () => {
    it('exposes previous midnight', () => {
        expect(
            (1).midnightAgo(new Date(2010, 5, 5, 1, 2, 3)).toISOString()
        ).to.equal('2010-06-05T00:00:00.000Z');
    });

    it('exposes 2 midnights ago', () => {
        expect(
            (2).midnightAgo(new Date(2010, 5, 5, 1, 2, 3)).toISOString()
        ).to.equal('2010-06-04T00:00:00.000Z');
    });
});

describe('relative timestamp', () => {
    it('can detect today', () => {
        expect(rstamp((2).hours().ago())).to.equal('today');
    });

    it('can detect yesterday', () => {
        expect(rstamp((1).days().ago())).to.equal('yesterday');
    });

    it('can detect 2 days ago', () => {
        expect(rstamp((2).days().ago())).to.equal('2 days ago');
    });

    it('can detect 3 days ago', () => {
        expect(rstamp((3).days().ago())).to.equal('3 days ago');
    });
});

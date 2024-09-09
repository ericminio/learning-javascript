const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

describe('time ago', () => {
    it('can detect today', () => {
        const time = lastMidnight().plus({ hours: 1 });
        const result = timeAgo(time);

        assert.strictEqual(result, 'today');
    });

    it('can detect yesterday', () => {
        const time = lastMidnight().minus({ hours: 1 });
        const result = timeAgo(time);

        assert.strictEqual(result, 'yesterday');
    });

    it('can detect 3 days ago', () => {
        const time = lastMidnight().plus({ hours: 1 }).minus({ days: 3 });
        const result = timeAgo(time);

        assert.strictEqual(result, '3 days ago');
    });
});

const lastMidnight = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};
const minutes = (value) => value * 60 * 1000;
const hours = (value) => value * minutes(60);
const days = (value) => value * hours(24);
const durations = {
    hours: hours,
    days: days,
};

const durationInMs = (duration) => {
    return Object.entries(duration).reduce(
        (acc, [unit, value]) => acc + durations[unit](value),
        0
    );
};

Date.prototype.plus = function (duration) {
    return new Date(this.getTime() + durationInMs(duration));
};

Date.prototype.minus = function (duration) {
    return new Date(this.getTime() - durationInMs(duration));
};

const timeAgo = (date) => {
    const midnight = lastMidnight();
    if (date.getTime() - midnight.getTime() > 0) {
        return 'today';
    }
    const previousMidnight = midnight.minus({ days: 1 });
    if (date.getTime() - previousMidnight.getTime() > 0) {
        return 'yesterday';
    }
    const diff = Math.floor(
        (midnight.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${diff + 1} days ago`;
};

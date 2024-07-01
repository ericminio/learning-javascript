const { expect } = require('chai');

describe('Drone', () => {
    describe('Steps', () => {
        it('is obvious with one or two targets', () => {
            var config = {
                base: { x: 0, y: 0 },
                targets: [
                    { x: 1, y: 1 },
                    { x: 1, y: 10 },
                ],
            };
            var path = optimize(config);

            expect(path).to.deep.equal([
                { x: 0, y: 0 },

                { x: 1, y: 1 },
                { x: 1, y: 10 },

                { x: 0, y: 0 },
            ]);
        });
        it('minimizes distance', () => {
            var config = {
                base: { x: 0, y: 0 },
                targets: [
                    { x: 1, y: 1 },
                    { x: 0, y: 1 },
                    { x: 2, y: 1 },
                ],
            };
            var path = optimize(config);

            expect(path).to.deep.equal([
                { x: 0, y: 0 },

                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },

                { x: 0, y: 0 },
            ]);
        });
    });
});

var optimize = (options) => {
    var path = [options.base];
    var targets = options.targets;
    if (targets.length > 2) {
        targets.sort((a, b) => {
            return distance(options.base, a) - distance(options.base, b);
        });
    }
    path = path.concat(targets);

    return path.concat(options.base);
};
var distance = (a, b) => {
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    if (dx < 0) {
        dx = -dx;
    }
    if (dy < 0) {
        dy = -dy;
    }

    return dx + dy;
};

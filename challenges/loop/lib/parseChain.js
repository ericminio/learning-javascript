const { id } = require('./id.js');
const { parsePositions } = require('./parsePositions.js');

const parseChain = (incoming) => {
    const dots = parsePositions(incoming);
    const chain = { ...dots };
    Object.keys(dots).forEach((key) => {
        const dot = dots[key];
        const current = { ...dot, next: undefined, previous: undefined };
        const right = dots[id({ x: dot.x + 1, y: dot.y })];
        if (!!right) {
            current.next = right.id;
        }
        const left = dots[id({ x: dot.x - 1, y: dot.y })];
        if (!!left) {
            current.previous = left.id;
        }

        chain[key] = current;
    });

    return chain;
};

module.exports = { parseChain };

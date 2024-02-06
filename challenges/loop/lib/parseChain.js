const { id } = require('./id.js');
const { parsePositions } = require('./parsePositions.js');
const initChain = (dots) =>
    Object.keys(dots).reduce((all, key) => {
        all[key] = {
            ...dots[key],
            next: undefined,
            previous: undefined,
        };
        return all;
    }, {});

const parseChain = (incoming) => {
    const dots = parsePositions(incoming);
    const chain = initChain(dots);
    Object.keys(chain).forEach((key) => {
        const current = chain[key];
        if (current.value === '-') {
            const right = chain[id({ x: current.x + 1, y: current.y })];
            if (!!right && right.value === '-') {
                current.next = right.id;
                right.previous = current.id;
            }
        }
        const under = chain[id({ x: current.x, y: current.y + 1 })];
        if (!!under && under.value === '|') {
            current.next = under.id;
            under.previous = current.id;
        }
    });

    return chain;
};

module.exports = { parseChain };

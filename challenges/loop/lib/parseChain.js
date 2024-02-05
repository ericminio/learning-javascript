const { parsePositions } = require('./parsePositions.js');

const parseChain = (incoming) => {
    const chain = {};
    const positions = parsePositions(incoming);
    Object.keys(positions).forEach((id) => {
        chain[id] = { ...positions[id], next: undefined, previous: undefined };
    });

    return chain;
};

module.exports = { parseChain };

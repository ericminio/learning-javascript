const { parsePositions } = require('./parsePositions.js');

const parseChain = (incoming) => {
    const dots = parsePositions(incoming);
    return dots;
};

module.exports = { parseChain };

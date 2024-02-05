const { id } = require('./id.js');
const { lines } = require('./parseLines.js');

const parsePositions = (incoming) => {
    const dots = {};
    const rows = lines(incoming);
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y];
        for (let x = 0; x < row.length; x++) {
            if (row[x] !== '.') {
                dots[id({ x, y })] = {
                    x,
                    y,
                    value: row[x],
                };
            }
        }
    }
    return dots;
};

module.exports = { parsePositions };

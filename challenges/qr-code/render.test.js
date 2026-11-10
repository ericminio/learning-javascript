const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix, computeDataPath } = require('./qrcode');
const { render } = require('./render');

describe('rendering', () => {
    it('renders a 1 as unicode square', () => {
        const matrix = generateQRCodeMatrix({ version: 1 });
        const rendered = render(matrix);
        const firstChar = rendered[0][0];
        assert.strictEqual(firstChar, '■');
    });
    it('renders a 0 as space', () => {
        const matrix = generateQRCodeMatrix({ version: 1 });
        const rendered = render(matrix);
        const bottomRight = rendered[1][1];
        assert.strictEqual(bottomRight, '.');
    });
});

describe('rendering example', () => {
    it('renders the entire matrix', () => {
        const matrix = generateQRCodeMatrix({ version: 1, text: 'Hi' });
        const rendered = render(matrix);
        console.log(rendered.map((row) => row.join(' ')).join('\n'));
    });
    it('discloses locked modules', () => {
        const matrix = generateQRCodeMatrix({ version: 1 });
        const rendered = matrix.map((row) =>
            row.map((cell) => (cell.locked === true ? 'L' : '.'))
        );
        console.log(rendered.map((row) => row.join(' ')).join('\n'));
    });
    it('discloses data path', () => {
        const matrix = generateQRCodeMatrix({ version: 1 });
        const path = computeDataPath(matrix);
        let index = 0;
        for (const { row, column } of path) {
            matrix[row][column].value = 10 + (index % 10);
            index++;
        }
        const rendered = matrix.map((row) =>
            row.map((cell) =>
                cell.value === 1
                    ? '■'
                    : cell.value >= 10
                    ? (cell.value % 10).toString()
                    : '.'
            )
        );
        console.log(rendered.map((row) => row.join(' ')).join('\n'));
    });
});

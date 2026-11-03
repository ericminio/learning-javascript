const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix } = require('./qrcode');
const { render } = require('./render');

describe('rendering', () => {
    it('renders a 1 as unicode square', () => {
        const matrix = generateQRCodeMatrix('version 1');
        const rendered = render(matrix);
        const firstChar = rendered[0][0];
        assert.strictEqual(firstChar, '■');
    });
    it('renders a 0 as space', () => {
        const matrix = generateQRCodeMatrix('version 1');
        const rendered = render(matrix);
        const bottomRight = rendered[1][1];
        assert.strictEqual(bottomRight, ' ');
    });
});

describe('rendering example', () => {
    it('renders the entire matrix', () => {
        const matrix = generateQRCodeMatrix('version 1');
        const rendered = render(matrix);
        console.log(rendered.map((row) => row.join('')).join('\n'));
    });
});

const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix, sizes } = require('./qrcode');
const { render } = require('./render');

describe('qr code', () => {
    it('is ready', () => {
        console.log(Array.from({ length: 3 }, () => Array(3).fill(0)));
        assert.strictEqual(1 + 1, 2);
    });

    describe('version 1', () => {
        it('uses a 21x21 matrix', () => {
            const matrix = generateQRCodeMatrix('version 1');
            assert.strictEqual(matrix.length, 21);
            assert.strictEqual(matrix[0].length, 21);
        });
        it('uses a 7x7 position pattern', () => {
            const pattern = sizes['version 1'].positionPattern();
            assert.deepEqual(pattern, [
                [1, 1, 1, 1, 1, 1, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 0, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 0, 1],
                [1, 0, 1, 1, 1, 0, 1],
                [1, 0, 0, 0, 0, 0, 1],
                [1, 1, 1, 1, 1, 1, 1],
            ]);
        });
        describe('fixed patterns', () => {
            it('contains a position pattern top-left', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(0, 0, 7, 7, matrix);
                assert.deepEqual(square, sizes['version 1'].positionPattern());
            });
            it('contains a position pattern top-right', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(0, 14, 7, 7, matrix);
                assert.deepEqual(square, sizes['version 1'].positionPattern());
            });
            it('contains a position pattern bottom-left', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(14, 0, 7, 7, matrix);
                assert.deepEqual(square, sizes['version 1'].positionPattern());
            });
            it('includes the dark module', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const darkModule = matrix[13][8];
                assert.strictEqual(darkModule, 1);
            });
        });
        describe('timing patterns', () => {
            it('includes one horizontal timing pattern', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const line = extract(6, 7, 7, 1, matrix)[0];
                assert.deepEqual(line, [0, 1, 0, 1, 0, 1, 0]);
            });
            it('includes one vertical timing pattern', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const line = extract(7, 6, 1, 7, matrix).map((row) => row[0]);
                assert.deepEqual(line, [0, 1, 0, 1, 0, 1, 0]);
            });
        });
        describe('encoded data', () => {
            it('starts with byte encoding mode', () => {
                const matrix = generateQRCodeMatrix('version 1', 'Hi');
                const encodingMode = extract(19, 19, 2, 2, matrix);
                assert.deepEqual(encodingMode, [
                    [1, 0],
                    [1, 1],
                ]);
            });
        });
    });
});

const extract = (row, column, width, height, matrix) => {
    const result = [];
    for (let r = row; r < row + height; r++) {
        const currentRow = [];
        for (let c = column; c < column + width; c++) {
            currentRow.push(matrix[r][c]);
        }
        result.push(currentRow);
    }
    return result;
};

const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix, mask, positionPattern } = require('./qrcode');

describe('qr code', () => {
    it('is ready', () => {
        console.log(Array.from({ length: 3 }, () => Array(3).fill(0)));
        assert.strictEqual(1 + 1, 2);
    });

    describe('version 1', () => {
        it('uses a 21x21 matrix', () => {
            const matrix = generateQRCodeMatrix({ version: 1 });
            assert.strictEqual(matrix.length, 21);
            assert.strictEqual(matrix[0].length, 21);
        });
        it('uses a 7x7 position pattern', () => {
            const pattern = positionPattern;
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
                const matrix = generateQRCodeMatrix({ version: 1 });
                const square = extract(0, 0, 7, 7, matrix);
                assert.deepEqual(square, positionPattern);
            });
            it('contains a position pattern top-right', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const square = extract(0, 14, 7, 7, matrix);
                assert.deepEqual(square, positionPattern);
            });
            it('contains a position pattern bottom-left', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const square = extract(14, 0, 7, 7, matrix);
                assert.deepEqual(square, positionPattern);
            });
            it('includes the dark module', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const darkModule = matrix[13][8].value;
                assert.equal(darkModule, 1);
            });
        });
        describe('timing patterns', () => {
            it('includes one horizontal timing pattern', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const line = extract(6, 7, 7, 1, matrix)[0];
                assert.deepEqual(line, [0, 1, 0, 1, 0, 1, 0]);
            });
            it('includes one vertical timing pattern', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const line = extract(7, 6, 1, 7, matrix).map((row) => row[0]);
                assert.deepEqual(line, [0, 1, 0, 1, 0, 1, 0]);
            });
        });
        describe('encoded data with mask 0', () => {
            it('starts with byte encoding mode (4)', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const maskedEncodingMode = extractWithRowColumnInfo(
                    19,
                    19,
                    2,
                    2,
                    matrix
                );
                assert.deepEqual(maskedEncodingMode, [
                    [
                        { row: 19, column: 19, value: 1 },
                        { row: 19, column: 20, value: 0 },
                    ],
                    [
                        { row: 20, column: 19, value: 1 },
                        { row: 20, column: 20, value: 1 },
                    ],
                ]);
                const maskedValue = maskedEncodingMode.flat().reverse();
                assert.deepEqual(maskedValue, [
                    { row: 20, column: 20, value: 1 },
                    { row: 20, column: 19, value: 1 },
                    { row: 19, column: 20, value: 0 },
                    { row: 19, column: 19, value: 1 },
                ]);
                const unmaskedValue = mask(maskedValue);
                assert.deepEqual(unmaskedValue, [
                    { row: 20, column: 20, value: 0 },
                    { row: 20, column: 19, value: 1 },
                    { row: 19, column: 20, value: 0 },
                    { row: 19, column: 19, value: 0 },
                ]);
                const binaryValue = unmaskedValue
                    .map(({ value }) => value)
                    .join('');
                const integerValue = parseInt(binaryValue, 2);
                assert.equal(integerValue, 4);
            });
        });
    });
});

const extract = (row, column, width, height, matrix) => {
    return extractWithRowColumnInfo(row, column, width, height, matrix).map(
        (r) => r.map((c) => c.value)
    );
};

const extractWithRowColumnInfo = (row, column, width, height, matrix) => {
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

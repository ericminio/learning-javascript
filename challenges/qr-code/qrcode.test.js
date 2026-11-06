const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix, mask, positionPattern } = require('./qrcode');

describe('qr code', () => {
    it('is ready', () => {
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
                const darkModule = matrix[13][8];
                assert.deepEqual(darkModule, {
                    row: 13,
                    column: 8,
                    value: 1,
                    locked: true,
                });
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
        describe('locked modules', () => {
            it('locks the position patterns', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                for (let r = 0; r < 7; r++) {
                    for (let c = 0; c < 7; c++) {
                        assert.strictEqual(matrix[r][c].locked, true);
                        assert.strictEqual(matrix[r][14 + c].locked, true);
                        assert.strictEqual(matrix[14 + r][c].locked, true);
                    }
                }
            });
            it('locks 2 bands of modules around the top-left position pattern', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        assert.strictEqual(matrix[r][c].locked, true);
                    }
                }
            });
            it('locks 1 column left and 2 rows below the top-right position pattern', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (c == 8) continue;
                        assert.strictEqual(matrix[r][20 - c].locked, true);
                    }
                }
            });
            it('locks 1 row above and 2 columns right of the bottom-left position pattern', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                for (let r = 0; r < 9; r++) {
                    for (let c = 0; c < 9; c++) {
                        if (r == 8) continue;
                        assert.strictEqual(matrix[20 - r][c].locked, true);
                    }
                }
            });
            it('locks the timing patterns', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                for (let r = 6; r < 7; r++) {
                    for (let c = 7; c < 14; c++) {
                        assert.strictEqual(matrix[r][c].locked, true);
                    }
                }
                for (let r = 7; r < 14; r++) {
                    for (let c = 6; c < 7; c++) {
                        assert.strictEqual(matrix[r][c].locked, true);
                    }
                }
            });
            it('locks the dark module', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                assert.strictEqual(matrix[13][8].locked, true);
            });
        });
        describe('encoded data with mask 0', () => {
            it('starts with byte encoding mode (0100)', () => {
                const matrix = generateQRCodeMatrix({ version: 1 });
                const maskedEncodingMode = extractWithRowColumnInfo(
                    19,
                    19,
                    2,
                    2,
                    matrix
                );
                assert.deepEqual(parseData(maskedEncodingMode), [0, 1, 0, 0]);
            });
            it('continues with the length of the data', () => {
                const matrix = generateQRCodeMatrix({ version: 1, text: 'Hi' });
                const maskedLength = extractWithRowColumnInfo(
                    15,
                    19,
                    2,
                    4,
                    matrix
                );
                assert.deepEqual(
                    parseData(maskedLength),
                    [0, 0, 0, 0, 0, 0, 1, 0]
                );
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

const parseData = (masked) => {
    const flattened = masked.flat().reverse();
    const unmasked = mask(flattened);
    return unmasked.map(({ value }) => value);
};

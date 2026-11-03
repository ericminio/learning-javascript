const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { generateQRCodeMatrix, positionPatternForVersion } = require('./qrcode');

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
            const pattern = positionPatternForVersion('version 1');
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
            it('contains a 1:1:3:1:1 position pattern top-left', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(0, 0, 7, 7, matrix);
                assert.deepEqual(
                    square,
                    positionPatternForVersion('version 1')
                );
            });
            it('contains a 1:1:3:1:1 position pattern top-right', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(14, 0, 7, 7, matrix);
                assert.deepEqual(
                    square,
                    positionPatternForVersion('version 1')
                );
            });
            it('contains a 1:1:3:1:1 position pattern bottom-left', () => {
                const matrix = generateQRCodeMatrix('version 1');
                const square = extract(0, 14, 7, 7, matrix);
                assert.deepEqual(
                    square,
                    positionPatternForVersion('version 1')
                );
            });
        });
    });
});

const extract = (x, y, width, height, matrix) => {
    const result = [];
    for (let i = y; i < y + height; i++) {
        const row = [];
        for (let j = x; j < x + width; j++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    return result;
};

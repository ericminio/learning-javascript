const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { computeDataPath } = require('./qrcode');

describe('data path', () => {
    it('starts with bottom-right corner', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
            ],
        ]);
        assert.deepStrictEqual(path[0], { row: 0, column: 1 });
    });
    it('continues with immediate left', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
            ],
        ]);
        assert.deepStrictEqual(path[1], { row: 0, column: 0 });
    });
    it('continues up right', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
            ],
        ]);
        assert.deepStrictEqual(path[2], { row: 0, column: 1 });
    });
    it('continues until first row', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
            ],
        ]);
        assert.deepStrictEqual(path[2], { row: 0, column: 1 });
    });
    it('stops when last module is locked', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0, locked: true },
                { row: 0, column: 1 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
            ],
        ]);
        assert.equal(path.length, 3);
    });
    it('jumps over locked modules', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1, locked: true },
            ],
        ]);
        assert.deepStrictEqual(path[0], { row: 0, column: 0 });
    });
    it('continues on previous column', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
                { row: 1, column: 2 },
                { row: 1, column: 3 },
            ],
        ]);
        assert.deepStrictEqual(path[4], { row: 0, column: 1 });
    });
    it('continues on previous column with immediate left', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
                { row: 1, column: 2 },
                { row: 1, column: 3 },
            ],
        ]);
        assert.deepStrictEqual(path[5], { row: 0, column: 0 });
    });
    it('continues down right on previous column', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
                { row: 1, column: 2 },
                { row: 1, column: 3 },
            ],
        ]);
        assert.deepStrictEqual(path[6], { row: 1, column: 1 });
    });
});

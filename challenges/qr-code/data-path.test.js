const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { columnGoesUp, computeDataPath } = require('./qrcode');

describe('column direction', () => {
    it('returns true for columns divisible by 4', () => {
        assert.equal(columnGoesUp(20, 20), true);
        assert.equal(columnGoesUp(16, 20), true);
        assert.equal(columnGoesUp(12, 20), true);
    });
    it('returns false for columns not divisible by 4', () => {
        assert.equal(columnGoesUp(18, 20), false);
        assert.equal(columnGoesUp(14, 20), false);
        assert.equal(columnGoesUp(10, 20), false);
    });
    it('accommodate ignoring column 6', () => {
        assert.equal(columnGoesUp(5, 20), false);
        assert.equal(columnGoesUp(3, 20), true);
        assert.equal(columnGoesUp(1, 20), false);
    });
});

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
    it('column index 6 is ignored (btw it is locked but this is not the point)', () => {
        const path = computeDataPath([
            [
                { row: 0, column: 0 },
                { row: 0, column: 1 },
                { row: 0, column: 2 },
                { row: 0, column: 3 },
                { row: 0, column: 4 },
                { row: 0, column: 5 },
                { row: 0, column: 6, locked: true },
                { row: 0, column: 7 },
                { row: 0, column: 8 },
            ],
            [
                { row: 1, column: 0 },
                { row: 1, column: 1 },
                { row: 1, column: 2 },
                { row: 1, column: 3 },
                { row: 1, column: 4 },
                { row: 1, column: 5 },
                { row: 1, column: 6, locked: true },
                { row: 1, column: 7 },
                { row: 1, column: 8 },
            ],
        ]);
        assert.deepStrictEqual(path[4], { row: 0, column: 5 });
        assert.deepStrictEqual(path[5], { row: 0, column: 4 });
    });
});

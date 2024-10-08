const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const { parseChain } = require('../lib/parseChain.js');

describe('parsing chain', () => {
    it('works with one ring', () => {
        const incoming = `
        .-.
        `;
        const chain = parseChain(incoming);

        assert.deepStrictEqual(chain, {
            '1x0': {
                id: '1x0',
                x: 1,
                y: 0,
                value: '-',
                next: undefined,
                previous: undefined,
            },
        });
    });
    it('works with two rings in line', () => {
        const incoming = `
        .--.
        `;
        const chain = parseChain(incoming);

        assert.deepStrictEqual(chain, {
            '1x0': {
                id: '1x0',
                x: 1,
                y: 0,
                value: '-',
                next: '2x0',
                previous: undefined,
            },
            '2x0': {
                id: '2x0',
                x: 2,
                y: 0,
                value: '-',
                next: undefined,
                previous: '1x0',
            },
        });
    });
    it('works with two rings in column', () => {
        const incoming = `
        .|.
        .|.
        `;
        const chain = parseChain(incoming);

        assert.deepStrictEqual(chain, {
            '1x0': {
                id: '1x0',
                x: 1,
                y: 0,
                value: '|',
                next: '1x1',
                previous: undefined,
            },
            '1x1': {
                id: '1x1',
                x: 1,
                y: 1,
                value: '|',
                next: undefined,
                previous: '1x0',
            },
        });
    });

    describe('corrupted incoming data scenarios', () => {
        it('cover wrong right connection', () => {
            const incoming = `
                .-|.
                `;
            const chain = parseChain(incoming);

            assert.deepStrictEqual(chain, {
                '1x0': {
                    id: '1x0',
                    x: 1,
                    y: 0,
                    value: '-',
                    next: undefined,
                    previous: undefined,
                },
                '2x0': {
                    id: '2x0',
                    x: 2,
                    y: 0,
                    value: '|',
                    next: undefined,
                    previous: undefined,
                },
            });
        });
        it('cover wrong underneath connection', () => {
            const incoming = `
                .|.
                .-.
                `;
            const chain = parseChain(incoming);

            assert.deepStrictEqual(chain, {
                '1x0': {
                    id: '1x0',
                    x: 1,
                    y: 0,
                    value: '|',
                    next: undefined,
                    previous: undefined,
                },
                '1x1': {
                    id: '1x1',
                    x: 1,
                    y: 1,
                    value: '-',
                    next: undefined,
                    previous: undefined,
                },
            });
        });
    });
});

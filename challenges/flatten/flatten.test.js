const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');

const sut = {
    separator: ':',
    flatten: (lines) => {
        const all = {};
        let acc = [];
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const key = line.substring(0, line.indexOf(sut.separator));
            const count = key.search(/\S/) / 2;
            const value = line
                .substring(line.indexOf(sut.separator) + sut.separator.length)
                .trim();
            acc.push(key.trim());
            if (value.length !== 0) {
                all[acc.join('.')] = value;
                for (let j = 0; j < (count ? count : 1); j++) {
                    acc.pop();
                }
            }
        }
        return all;
    },
};

describe('flatten', () => {
    it('works for one entry', () => {
        const flattened = sut.flatten(['a: one']);

        assert.deepStrictEqual(flattened, {
            a: 'one',
        });
    });
    it('works for two entries', () => {
        const flattened = sut.flatten(['a: one', 'b: two']);

        assert.deepStrictEqual(flattened, {
            a: 'one',
            b: 'two',
        });
    });
    it('works with one nested entry', () => {
        const flattened = sut.flatten(['a:', '  b: nested']);

        assert.deepStrictEqual(flattened, {
            'a.b': 'nested',
        });
    });
    it('works with parallel nested entries', () => {
        const flattened = sut.flatten(['a:', '  b: first', '  c: second']);

        assert.deepStrictEqual(flattened, {
            'a.b': 'first',
            'a.c': 'second',
        });
    });
    it('works with nested parallel entries', () => {
        const flattened = sut.flatten([
            'a:',
            '  b:',
            '    c: hello',
            '  d: world',
        ]);

        assert.deepStrictEqual(flattened, {
            'a.b.c': 'hello',
            'a.d': 'world',
        });
    });
});

const { describe, it } = require('node:test');
const { strict: assert } = require('node:assert');
const { Readable } = require('node:stream');
const { open } = require('node:fs/promises');

describe('Readable Stream', () => {
    it('can be built from array', async () => {
        const incoming = [3, 5, 7];
        const stream = Readable.from(incoming);
        const received = await new Promise((resolve) => {
            const buffer = [];
            stream.on('data', (chunk) => {
                buffer.push(chunk);
            });
            stream.on('end', () => {
                resolve(buffer);
            });
        });
        assert.deepStrictEqual(received, [3, 5, 7]);
    });

    it('can read a file one char at a time', async () => {
        const fd = await open('./school/node/data/a-file.txt');
        const stream = fd.createReadStream({ highWaterMark: 1 });
        const received = await new Promise((resolve) => {
            const buffer = [];
            stream.on('data', (chunk) => {
                buffer.push(chunk.toString());
            });
            stream.on('close', () => {
                resolve(buffer);
            });
        });
        assert.deepStrictEqual(received, [
            'f',
            'i',
            'r',
            's',
            't',
            ' ',
            'l',
            'i',
            'n',
            'e',
            '\n',
            's',
            'e',
            'c',
            'o',
            'n',
            'd',
            ' ',
            'l',
            'i',
            'n',
            'e',
        ]);
    });

    it('can read a file one word at a time', async () => {
        const fd = await open('./school/node/data/a-file.txt');
        const stream = fd.createReadStream({ highWaterMark: 1 });
        const received = await new Promise((resolve) => {
            const buffer = [];
            let word = '';
            const keep = () => {
                buffer.push(word);
                word = '';
            };
            stream.on('data', (chunk) => {
                if ([' ', '\n'].includes(chunk.toString())) {
                    keep();
                } else {
                    word += chunk.toString();
                }
            });
            stream.on('end', () => {
                keep();
            });
            stream.on('close', () => {
                resolve(buffer);
            });
        });
        assert.deepStrictEqual(received, ['first', 'line', 'second', 'line']);
    });
});

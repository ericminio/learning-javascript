const { expect } = require('chai');
const { isFrameFinal, isText, decodeLength, extractMask, extractData, decode } = require('./websocket-frames.js');

describe.only('single frame text decoding', () => {

    const abcdef = Buffer.from([0x81, 0x86, 0xb0, 0x4c, 0x40, 0xcd, 0xd1, 0x2e, 0x23, 0xa9, 0xd5, 0x2a]);

    it('can be identified as single frame', () => {
        expect(isFrameFinal(abcdef)).to.equal(true);
    });

    it('can be identified as text', () => {
        expect(isText(abcdef)).to.equal(true);
    });

    it('has length available', () => {
        const length = decodeLength(abcdef);

        expect(length).to.equal(6);
    });

    it('has mask available', () => {
        const mask = extractMask(abcdef);

        expect(mask).to.deep.equal(Buffer.from([0xb0, 0x4c, 0x40, 0xcd]));
    });

    it('has data available', () => {
        const data = extractData(abcdef);

        expect(data).to.deep.equal(Buffer.from([0xd1, 0x2e, 0x23, 0xa9, 0xd5, 0x2a]));
    });

    it('can be decoded', () => {
        const decoded = decode(abcdef);

        expect(decoded).to.equal('abcdef');
    });

});
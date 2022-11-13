const { expect } = require('chai');

const FIRST_BIT_OF_BYTE_MASK = 0x80;
const LAST_BIT_OF_BYTE_MASK = 0x01;
const isFirstBitSet = (byte) => {
    return (byte & FIRST_BIT_OF_BYTE_MASK) === FIRST_BIT_OF_BYTE_MASK;
};
const isLastBitSet = (byte) => {
    return (byte & LAST_BIT_OF_BYTE_MASK) === LAST_BIT_OF_BYTE_MASK;
};
const isFrameFinal = (buffer) => {
    return isFirstBitSet(buffer.readUInt8(0));
};
const isText = (buffer) => {
    return isLastBitSet(buffer.readUInt8(0));
};
const decodeLength = (buffer) => {
    const secondByte = buffer.readUInt8(1);

    return secondByte - (isFirstBitSet(secondByte) ? FIRST_BIT_OF_BYTE_MASK : 0);
};
const extractMask = (buffer) => Buffer.from([2, 3, 4, 5].map(offset => buffer.readUInt8(offset)))
const extractData = (buffer) => {
    const length = decodeLength(buffer);
    let data = Buffer.alloc(length);
    for (var i = 0; i < length; i++) {
        data.writeUInt8(buffer.readUInt8(6 + i), i);
    }
    return data;
};
const decode = (buffer) => {
    const data = extractData(buffer);
    const mask = extractMask(buffer);
    const decoded = Buffer.from(Uint8Array.from(data, (byte, index) => byte ^ mask[index % 4]));

    return decoded.toString();
};

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
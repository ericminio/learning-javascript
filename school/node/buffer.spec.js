const { expect } = require('chai');
const show0and1 = (buffer) => [...buffer].map(b => b.toString(2).padStart(8, '0')).join(' ')

describe('Buffer', () => {

    it('can be compared', () => {
        expect(Buffer.from([0x81, 0x86])).to.deep.equal(Buffer.from([0x81, 0x86]));
    });

    it('can be displayed as binary with little work', () => {
        const buffer = Buffer.from([0x11, 0xff]);

        expect(show0and1(buffer)).to.equal('00010001 11111111')
    });

    it('can be inspected byte per byte', () => {
        const buffer = Buffer.from([0x80, 0x11]);

        expect(buffer[0]).to.equal(0x80);
        expect(buffer[1]).to.equal(0x11);
    });

});
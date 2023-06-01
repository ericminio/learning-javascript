const { expect } = require('chai');

describe('ECMAScript 6', function () {
    it('introduces destructuring', function () {
        const options = { message: 'hello world', source: 'a friend' };
        const { message } = options;

        expect(message).to.equal('hello world');
    });
    it('introduces classes', function () {
        class Greeting {
            constructor(value) {
                this.value = value;
            }
            message() {
                return this.value;
            }
        }
        const output = new Greeting('hello world').message();

        expect(output).to.equal('hello world');
    });
    it('introduces template literals', function () {
        const a = 'world';

        expect(`hello ${a}`).to.equal('hello world');
    });
    it('introduces multi-line strings', function () {
        const output = `
        hello
            world`;

        expect(output).to.equal('\n        hello\n            world');
    });
    it('introduces rest operator', function (sir) {
        const concatenate = (...args) => {
            return args.join(' ');
        };
        const output = concatenate('hello', 'world');

        expect(output).to.equal('hello world');
    });
});

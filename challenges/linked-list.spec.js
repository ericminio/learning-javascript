var expect = require('chai').expect;

describe('Linked list inversion', function () {
    it('is easy with one element', () => {
        let head = { value: 42, next: undefined };
        expect(invert(head)).to.deep.equal({ value: 42, next: undefined });
    });
    describe('helpers', () => {
        describe('list from string', () => {
            it('is available', () => {
                expect(list('11 --> 22')).to.deep.equal({
                    value: 11,
                    next: { value: 22, next: undefined },
                });
            });
        });
        describe('list to string', () => {
            it('is availble', () => {
                expect(stringify(list('11 --> 22'))).to.equal('11 --> 22');
            });
        });
    });
    it('also works with two elements', () => {
        let inverted = invert(list('1 --> 2'));
        expect(stringify(inverted)).to.equal('2 --> 1');
    });
    it('should also work with three elements', () => {
        let inverted = invert(list('1 --> 2 --> 3'));
        expect(stringify(inverted)).to.equal('3 --> 2 --> 1');
    });
});

var invert = (head) => {
    let previous = undefined,
        current = head,
        next = current.next;
    if (next !== undefined) {
        current.next = previous;
        previous = current;
        current = next;
    }
    current.next = previous;
    return current;
};

let list = (input) => {
    let nodes = [];
    let values = input.split('-->');
    for (let i = 0; i < values.length; i++) {
        let node = { value: parseInt(values[i]), next: undefined };
        nodes.push(node);
        if (i > 0) {
            nodes[i - 1].next = node;
        }
    }
    return nodes[0];
};
let stringify = (head) => {
    let current = head;
    let safe = 7;
    let output = '' + current.value;
    while (current.next !== undefined && safe > 0) {
        current = current.next;
        safe--;
        output += ' --> ' + current.value;
    }
    if (safe == 0) {
        output += '...';
    }
    return output;
};

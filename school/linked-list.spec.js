var expect = require('chai').expect;

describe('Linked list inversion', function() {

    it('is easy with one element', ()=>{
        let head = { value:42, next:undefined };
        expect(invert(head)).to.deep.equal({ value:42, next:undefined });
    });
    let list = (input)=> {
        let nodes = [];
        let values = input.split('-->');
        for (let i=0; i<values.length; i++) {
            let node = { value: parseInt(values[i]), next:undefined} ;
            nodes.push(node);
            if (i > 0) {
                nodes[i-1].next = node;
            }
        }
        return nodes[0];
    };
    let stringify = (head)=> {
        let current = head;
        let safe = 100;
        let output = '' + current.value;
        while (current.next !== undefined && safe > 0) {
            current = current.next;
            safe --;
            output += ' --> ' + current.value;
        }
        return output;
    }
    it('also works with two elements', ()=>{
        let head = list('1 --> 2');
        let inverted = invert(head);
        expect(stringify(inverted)).to.equal('2 --> 1');
    });
    it('also works with thress elements', ()=>{
        let head = list('1 --> 2 --> 3');
        let inverted = invert(head);
        expect(stringify(inverted)).to.equal('3 --> 2 --> 1');
    });
});

var invert = (head)=> {
    let previous = undefined, 
        current = head,
        next = current.next;
    current.next = previous;

    while (next !== undefined) {    
        previous = current;
        current = next;
        next = current.next;

        current.next = previous;
    }
    return current;
}
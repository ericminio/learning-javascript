var expect = require('chai').expect;

describe('Linked list inversion', function() {

    it('is easy with one element', ()=>{
        let head = { value:42, next:undefined };
        expect(inverted(head)).to.deep.equal({ value:42, next:undefined });
    });
    it('also works with two elements', ()=>{
        let head = { 
            value:1, 
            next:{ 
                value:2, 
                next:undefined } };
        expect(inverted(head)).to.deep.equal({ 
            value:2, 
            next:{ 
                value:1, 
                next:undefined }});
    });
    it('also works with thress elements', ()=>{
        let head = { 
            value:1, 
            next:{ 
                value:2, 
                next:{ 
                    value:3, 
                    next:undefined } } };
        expect(inverted(head)).to.deep.equal({ 
            value:3, 
            next:{ 
                value:2, 
                next:{ 
                    value:1, 
                    next:undefined } }});
    });
});

var inverted = (head)=> {
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
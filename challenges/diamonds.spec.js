var spaces = function(count) {
    blank = '';
    for (var i=0; i<count; i++) { blank += ' '; }
    return blank;
};

var sculpt = function(code) {
    return String.fromCharCode(code);
};

var decorate = function(index) {
    if (index ===0) { return sculpt(65); }
    return sculpt(65+(index)) + spaces(1+2*(index-1)) + sculpt(65+(index))
};

var diamond = function(size) {
    var lines = [];        
    for (var i=0; i<size; i++) {
        lines.push(spaces(size-(i+1)) + decorate(i));    
    }
    
    var above = lines;
    var horizon = lines.pop();
    var below = lines.join('.').split('.').reverse();
    return above.concat(horizon, below);
};

var he = it;
describe('Diamond creator', function() {
   
    describe('objective', function() {
        
        he('is to be able to create a diamond of size 3', function() {
            expect(diamond(4)).toEqual([
                '   A',
                '  B B',
                ' C   C',
                'D     D',
                ' C   C',
                '  B B',
                '   A'
            ]);
        });        
    });
    
    describe('steps:', function() {
        
        he('can create space', function() {
            expect(spaces(5)).toEqual('     ');
        });   
        
        he('can sculpt precicely', function() {
            expect(sculpt(65)).toEqual('A');
            expect(sculpt(66)).toEqual('B');
        });   
        
        he('can decorate', function() {
            expect(decorate(1)).toEqual('B B');
        });
        
        he('can contain enthousiasm', function() {
            expect(decorate(0)).toEqual('A');
        });
    });
});
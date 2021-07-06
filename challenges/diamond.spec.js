const { expect } = require('chai');

var diamond = function(size) {
};

describe('Diamond creator', function() {
   
    describe('objective', function() {
        
        it('is to be able to create a diamond', function() {
            expect(diamond(4)).to.equal([
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
});
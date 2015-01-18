var diamond = function(size) {
};

describe('Diamond creator', function() {
   
    describe('objective', function() {
        
        it('is to be able to create a diamond of size 3', function() {
            expect(diamond(3)).toEqual([
                '  A',
                ' B B',
                'C   C',
                ' B B',
                '  A'
            ]);
        });        
    });
});
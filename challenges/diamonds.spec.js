var diamond = function(size) {
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
});
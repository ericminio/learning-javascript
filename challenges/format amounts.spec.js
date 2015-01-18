var formatAmount = function(input) {
    
};

describe('Amount formatting', function() {

    describe('Target', function() {
        
        it('can format a big amount with 2 decimals', function() {
            expect(formatAmount(11222333444555.45)).toEqual('11 222 333 444 555,45 $');
        });
        
        it('can format a big amount with 1 decimals', function() {
            expect(formatAmount(11222333444555.4)).toEqual('11 222 333 444 555,40 $');
        });
        
        it('can format a big amount with no decimal', function() {
            expect(formatAmount(11222333444555)).toEqual('11 222 333 444 555,00 $');
        });
        
    });
});
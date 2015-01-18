var formatAmount = function(input) {
    
    var amount = input.toString().replace('\.', ',');
    if (amount.indexOf(',') == -1) {
        amount = amount + ',00';
    }
    var beforeComa = amount.substring(0, amount.indexOf(','));
    var afterComa = amount.substring(amount.indexOf(','));
    if (afterComa.length == 2) {
        afterComa += '0';
    }
    
    var parts = beforeComa.toString().split('').reverse().join('').match(/.{1,3}/g);
    for (var i=parts.length-1; i>=0; i--) {
        parts[i] = parts[i].split('').reverse().join('');
    }
    
    var formated = parts.reverse().join(' ') + afterComa + ' $';
    
    if (input < 0) {
        formated = '(' + formated.substring(1) + ')';
    }
    
    return formated;
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
    
    describe('Steps', function() {
        
        it('can format a small amount', function() {
            expect(formatAmount(1)).toEqual('1,00 $');
        });

        it('can format 1000', function() {
            expect(formatAmount(1000)).toEqual('1 000,00 $');
        });
        
        it('can format decimals', function() {
            expect(formatAmount(.2)).toEqual('0,20 $');
        });

        it('can format negative amount', function() {
            expect(formatAmount(-1234)).toEqual('(1 234,00 $)');
        });
    });
});
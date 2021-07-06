const { expect } = require('chai');
var Sculptor = function() {};

Sculptor.prototype = {
  
    explore: function(mine) {
        return this;
    },
    
    findAStoneOfSize: function(size) {
    }
};

she = it;

describe('Sculptor', function() {

    var Ufa = new Sculptor();
    
    describe('at work', function() {
        
        she('chooses the best rock', function() {
            var mine = {
                rocks: [
                    [ '*' ],
                    [ '***', '***', '***' ],
                    [ '**', '**', '**', '**', '**' ],
                    [ '*****', '*****', '*****', '*****', '*****' ],
                    [ '*****', '**', '**', '*****', '*****' ],
                    [ '**', '**', '**', '**', '**' ],
                    [ '*****', '*****', '*****', '*****', '*****', '*****' ],
                ]
            }
        
            expect(Ufa.explore(mine).findAStoneOfSize(3)).to.equal([
                '*****',
                '*****',
                '*****',
                '*****',
                '*****'
            ]);
        });
    
        she.skip('sculpts the rock', function() {
            expect(Ufa.sculpt([
                '*****',
                '*****',
                '*****',
                '*****',
                '*****'
            ])).to.equal([
                '  *  ',
                ' *** ',
                '*****',
                ' *** ',
                '  *  '
            ]);
        });
        
        she.skip('decorate the stone', function() {
            expect(Ufa.decorate([
                '  *  ',
                ' *** ',
                '*****',
                ' *** ',
                '  *  '
            ])).to.equal([
                '  A  ',
                ' B*B ',
                'C***C',
                ' B*B ',
                '  A  '
            ]);
        });
        
        she.skip('polishes the diamond', function() {
            expect(Ufa.polish([
                '  A  ',
                ' B*B ',
                'C***C',
                ' B*B ',
                '  A  '
            ])).to.equal([
                '  A  ',
                ' B B ',
                'C   C',
                ' B B ',
                '  A  '
            ]);
        });
    });
});
var Sculptor = function() {};

Sculptor.prototype = {
  
    explore: function(mine) {
        return this;
    },
    
    findAStoneOfSize: function(size) {
    }
};

she = it;
xshe = xit;

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
        
            expect(Ufa.explore(mine).findAStoneOfSize(3)).toEqual([
                '*****',
                '*****',
                '*****',
                '*****',
                '*****'
            ]);
        });
    
        xshe('sculpts the rock', function() {
            expect(Ufa.sculpt([
                '*****',
                '*****',
                '*****',
                '*****',
                '*****'
            ])).toEqual([
                '  *  ',
                ' *** ',
                '*****',
                ' *** ',
                '  *  '
            ]);
        });
        
        xshe('decorate the stone', function() {
            expect(Ufa.decorate([
                '  *  ',
                ' *** ',
                '*****',
                ' *** ',
                '  *  '
            ])).toEqual([
                '  A  ',
                ' B*B ',
                'C***C',
                ' B*B ',
                '  A  '
            ]);
        });
        
        xshe('polishes the diamond', function() {
            expect(Ufa.polish([
                '  A  ',
                ' B*B ',
                'C***C',
                ' B*B ',
                '  A  '
            ])).toEqual([
                '  A  ',
                ' B B ',
                'C   C',
                ' B B ',
                '  A  '
            ]);
        });
    });
});
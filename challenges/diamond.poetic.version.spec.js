var Sculptor = function() {};

Sculptor.prototype = {
  
    explore: function(mine) {
        this.mine = mine;
        return this;
    },
    
    findAStoneOfSize: function(size) {
        var found;
        this.mine.rocks.forEach(function(rock) {
            var match = rock.length == 2*size-1;
            rock.forEach(function(layer) {
                match = match & layer.length == 2*size-1;
            });
            if (!found && match) {
                found = rock;
            }
        });
        return found;
    },
    
    sculpt: function(rock) {
        var stone = [];
        
        var she = this;
        rock.forEach(function(layer, index) {
            stone.push(she.sculptLayer(layer, index));
        });
        
        return stone;
    },
    
    sculptLayer: function(layer, index) {
        var size = layer.length;
        var depth = Math.abs(index - (size-1)/2);
        
        return this.hit(depth, layer);
    },
    
    hit: function(depth, layer) {
        
        var spaces = function(count) {
            var hole = '';
            for (var i=0; i<count; i++) { hole+= ' '; }
            return hole;
        }
        
        return spaces(depth) + layer.substring(depth, layer.length-depth) + spaces(depth);
    },
    
    decorate: function(stone) {
        var diamond = [];
        
        var she = this;
        stone.forEach(function(layer, index) {            
            diamond.push(she.decorateLayer(layer, index));
        });
        
        return diamond;
    },
    
    decorateLayer: function(layer, index) { 
        var size = layer.length;
        var code = 65 + (size-1)/2 - Math.abs(index - (size-1)/2);        
        var letter = String.fromCharCode(code);
        
        return layer.replace('*', letter).replace(/.(\s*)$/, letter + '$1');        
    },
    
    polish: function(diamond) {
        var jewel = [];
        
        var she = this;
        diamond.forEach(function(layer) {
            jewel.push(she.polishLayer(layer));
        });
        
        return jewel;
    },
    
    polishLayer: function(layer) {
        return layer.replace(/\*/g, ' ');
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
        
            expect(Ufa.explore(mine).findAStoneOfSize(3)).toEqual([
                '*****',
                '*****',
                '*****',
                '*****',
                '*****'
            ]);
        });
    
        she('sculpts the rock', function() {
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
        
        she('decorate the stone', function() {
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
        
        she('polishes the diamond', function() {
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
    
    describe('at school', function() {
        
        she('learns how to sculpt the layers', function() {
            expect(Ufa.sculptLayer('***', 0)).toEqual(' * ');
            expect(Ufa.sculptLayer('*****', 0)).toEqual('  *  ');

            expect(Ufa.sculptLayer('***', 1)).toEqual('***');
            expect(Ufa.sculptLayer('*****', 1)).toEqual(' *** ');
        });
        
        she('learns how to hit the layers', function() {
            expect(Ufa.hit(2, '*****')).toEqual('  *  ');
            expect(Ufa.hit(1, '*****')).toEqual(' *** ');
        });
        
        she('learns how to decorate the layers', function() {
            expect(Ufa.decorateLayer(' * ', 0)).toEqual(' A ');
            expect(Ufa.decorateLayer(' * ', 2)).toEqual(' A ');
            
            expect(Ufa.decorateLayer(' *** ', 1)).toEqual(' B*B ');
            expect(Ufa.decorateLayer(' *** ', 3)).toEqual(' B*B ');
        });
        
        she('learns how to polish the layers', function() {
            expect(Ufa.polishLayer(' B*B ')).toEqual(' B B ');
        });
    });
});
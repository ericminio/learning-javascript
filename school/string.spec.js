describe('string', function() {
   
    describe('replace', function() {
        
        it('can use regex', function() {
            expect('red is good'.replace(/red/g, 'green')).toEqual('green is good');
        });
        
        it('works to replace the first occurence of a char', function() {
            expect('***'.replace(/^\*/, 'A')).toEqual('A**');
        });

        it('only replaces first occurence', function() {
            expect('  ***  '.replace('*', 'A')).toEqual('  A**  ');
        });
        
        it('can replace the last occurence with the help of a regexp', function() {
            expect('  ***  '.replace(/.(\s*)$/, 'A$1')).toEqual('  **A  ');
        });
        
        it('can replace the first and the last occurence with the help of a regexp', function() {
            expect('  ***  '.replace(/^(\s*)(\*)(\**)(\*)(\s*)$/, '$1B$3B$5')).toEqual('  B*B  ');
        });
    });
});
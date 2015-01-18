describe('Char', function() {
   
    it('can be converted into a code', function() {
        expect("A".charCodeAt(0)).toEqual(65);
    });

    it('can be built from a code', function() {
        expect(String.fromCharCode(65)).toEqual('A');
    });
});
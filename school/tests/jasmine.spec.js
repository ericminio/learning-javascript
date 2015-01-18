describe('Jasmine', function() {

    it('can assert number equality', function() {
        expect(1).toEqual(1);
    });
    
	it('considers different two objects with different fields', function() {
		expect({ one: 'any' }).not.toEqual({ two: 'any' });
	});
		
	it('considers different two objects with same fields and different values', function() {
		expect({ field: 'one' }).not.toEqual({ field: 'two' });
	});
		
	it('considers equal two objects with one field and same value', function() {
		expect({ field: 'one' }).toEqual({ field: 'one' });
	});
    
});
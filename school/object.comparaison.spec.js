describe('Object comparaison', function() {
	
	it('considers different two objects with different fields', function() {
		expect({ one: 'any' } == { two: 'any' }).toEqual(false);
	});
		
	it('considers different two objects with same fields and different values', function() {
		expect({ field: 'one' } == { field: 'two' }).toEqual(false);
	});
		
	it('considers different two objects with one field and same value', function() {
		expect({ field: 'one' } == { field: 'one' }).toEqual(false);
	});
		
	it('considers different objects with two fields and same values', function() {
		expect({ one: 'one', two: 'two' }).toEqual({ one: 'one', two: 'two' });
	});
		
	it('considers different objects with two fields and different values', function() {
		expect({ one: 'one', two: 'two' }).not.toEqual({ one: 'one', two: 'not two' });
	});

	it('considers different objects with two fields and same values but different order', function() {
		expect({ one: 'one', two: 'two' }).not.toEqual({ two: 'not two', one: 'one' });
	});
	
	it('can consider equal two objects with two fields in different orders when using deep-equal', function() {
		var first = { one: 'one', two: 'two' };
		var second = { two: 'two', one: 'one' };
		var equal = require('deep-equal');

		expect(equal(first, second)).toBe(true);
	});
});

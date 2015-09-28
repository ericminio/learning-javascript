var expect = require('chai').expect;

describe('Object comparaison', function() {

	it('considers different two objects with different fields', function() {
		expect({ one: 'any' } == { two: 'any' }).to.equal(false);
	});

	it('considers different two objects with same fields and different values', function() {
		expect({ field: 'one' } == { field: 'two' }).to.equal(false);
	});

	it('considers different two objects with one field and same value', function() {
		expect({ field: 'one' } == { field: 'one' }).to.equal(false);
	});

	it('considers different objects with two fields and same values', function() {
		expect({ one: 'one', two: 'two' }).to.deep.equal({ one: 'one', two: 'two' });
	});

	it('considers different objects with two fields and different values', function() {
		expect({ one: 'one', two: 'two' }).not.to.equal({ one: 'one', two: 'not two' });
	});

	it('considers different objects with two fields and same values but different order', function() {
		expect({ one: 'one', two: 'two' }).not.to.equal({ two: 'not two', one: 'one' });
	});

	it('can consider equal two objects with two fields in different orders when using deep-equal', function() {
		var first = { one: 'one', two: 'two' };
		var second = { two: 'two', one: 'one' };
		var equal = require('deep-equal');

		expect(equal(first, second)).to.equal(true);
	});
});

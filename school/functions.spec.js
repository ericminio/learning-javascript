var expect = require('chai').expect;

describe("Functions", function() {

	describe("declaration", function() {

		it("can be identified as function with the typeof keyword", function() {
			expect(typeof function() { return 2; } ).to.equal('function');
		});
	});

	it("can be evaluated with trailing parens", function() {
		expect( function() { return 2;}() ).to.equal(2);
	});

	it("can accept params", function() {
		expect( function(value) { return value;}(3) ).to.equal(3);
	});

	describe("nested functions", function() {

		it("can access fields of the outer function", function() {
			sequence = function() {
				var n = 0;

                return {
					next : function() { return ++n; }
				};
			}();

			expect(sequence.next()).to.equal(1);
			expect(sequence.next()).to.equal(2);
		});
	});

	describe('runtime creation', function() {

		it('can be done from a string', function() {
			var service = new Function('return "hello";');

			expect(service()).to.equal('hello');
		});
		it('is a way to expose an api that is not a node module', function() {
			var externalApi = 'var greetings = function() { return "hello"; };';
			var service = (new Function( externalApi + 'return greetings;'))();

			expect(service()).to.equal('hello');
		});
	});
});

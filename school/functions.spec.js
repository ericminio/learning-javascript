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
});

describe("Prototype", function() {

	describe("Adding methods to classes", function() {


		it("can be done via the prototype keyword", function() {
			
			Array.prototype.theFirstItemPlease = function() {
				return this[0];
			};
			
			var items = ["one", "two"];
			
			expect(items.theFirstItemPlease()).toEqual("one");
		});
		
		it("can be useful for example to compare strings", function() {
			String.prototype.greaterThan = function(other) {
				return this == "Me";
			};
			
			expect("Me".greaterThan("You")).toBe(true);
		});
		
		it("works even on custom objects", function() {
		
			Object.prototype.greaterThan = function(other) {
				return this.field > other.field;
			};
			
			var one = { field: 1};
			var two = { field: 2};
			
			expect(one.greaterThan(two)).toBe(false);
		});
		
	});

});

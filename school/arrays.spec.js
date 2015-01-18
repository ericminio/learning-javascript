describe("Arrays", function() {

	var array, one, two;
	
	beforeEach(function() {
		array = [];
		one = { value : "first" };
		two = { value : "second" };
	});

	describe("adding elements", function() {
	
		it("'push' adds at the end by default", function() {
			array.push(one);
			array.push(two);
			
			expect(array[1]).toBe(two);
		});
		
		it("'unshift' adds at the beggining", function() {
			array.unshift(one);
			array.unshift(two);
			
			expect(array[0]).toBe(two);
		});
		
		it("'splice' offers insertion", function() {
			array.push(one);
			array.push(two);
			bird = { value : "bird" };
			array.splice(0, 1, bird);
			
			expect(array[0]).toBe(bird);
		});
		
		it("'splice' offers multi-insertion", function() {
			array.push(one);
			array.push(two);
			fox = { value : "fox" };
			cat = { value : "cat" };
			array.splice(1, 2, fox, cat);
			
			expect(array[1]).toBe(fox);
			expect(array[2]).toBe(cat);
		});
	});

	describe("removing elements", function() {
		
		it("'pop' removes the last element", function() {
			array.push(one);
			array.push(two);
			array.pop();
			
			expect(array.length).toEqual(1);
			expect(array[0]).toBe(one);
		});
		
		it("'shift' removes the first element", function() {
			array.push(one);
			array.push(two);
			array.shift();
			
			expect(array.length).toEqual(1);
			expect(array[0]).toBe(two);
		});
		
		it("'splice' can help to remove any element", function() {
			array.push(one);
			array.push(two);
			array.splice(array.indexOf(one), 1);
			
			expect(array.length).toEqual(1);
			expect(array[0]).toBe(two);			
		});
		
	});

	describe("2D", function() {
		
		var grid, A1, B2;

		beforeEach(function() {
			grid = [];
			A1 = { value : "first" }
			B2 = { value : "second" }
		});

		it("can be simulated with arrays of arrays", function() {
			grid[0] = [];
			grid[1] = [];
			grid[0][0] = A1;
			grid[1][1] = B2;

			expect(grid[0][0]).toBe(A1);
			expect(grid[1][1]).toBe(B2);
		});
	});
	
    describe('instanceof Array', function() {
    
        var isArray = function(o) {
            return o instanceof Array;
        };

        it('returns false for an integer', function() {
            expect(isArray(1)).toEqual(false);
        });
    
        it('returns false for a string', function() {
            expect(isArray("42")).toEqual(false);
        });
    
        it('returns true for a empty array', function() {
            expect(isArray([])).toEqual(true);
        });
    
    });
});
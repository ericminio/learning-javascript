var expect = require('chai').expect;

describe("Arrays", function () {

	var array, one, two;

	beforeEach(function () {
		array = [];
		one = { value: "first" };
		two = { value: "second" };
		three = { value: "three" };
	});

	describe("adding elements", function () {

		it("'push' adds at the end by default", function () {
			array.push(one);
			array.push(two);

			expect(array[1]).to.equal(two);
		});

		it("'unshift' adds at the beggining", function () {
			array.unshift(one);
			array.unshift(two);

			expect(array[0]).to.equal(two);
		});

		it("'splice' offers insertion", function () {
			array.push(one);
			array.push(two);
			var bird = { value: "bird" };
			array.splice(0, 1, bird);

			expect(array[0]).to.equal(bird);
		});

		it("'splice' offers multi-insertion", function () {
			array.push(one);
			array.push(two);
			var fox = { value: "fox" };
			var cat = { value: "cat" };
			array.splice(1, 2, fox, cat);

			expect(array[1]).to.equal(fox);
			expect(array[2]).to.equal(cat);
		});
	});

	describe.only("removing elements", function () {

		it("'pop' removes the last element", function () {
			array.push(one);
			array.push(two);
			array.pop();

			expect(array.length).to.equal(1);
			expect(array[0]).to.equal(one);
		});

		it("'pop' returns the last element", function () {
			array.push(one);
			array.push(two);

			expect(array.pop()).to.equal(two);
		});

		it("'shift' removes the first element", function () {
			array.push(one);
			array.push(two);
			array.shift();

			expect(array.length).to.equal(1);
			expect(array[0]).to.equal(two);
		});

		it("'splice' can help to remove any element", function () {
			array.push(one);
			array.push(two);
			array.splice(array.indexOf(one), 1);

			expect(array.length).to.equal(1);
			expect(array[0]).to.equal(two);
		});

		it("'splice' with one paramter is a shortcut to remove the beginning of an array", function () {
			array.push(one);
			array.push(two);
			array.push(three);
			const deleted = array.splice(1);

			expect(deleted.length).to.equal(2);
			expect(deleted[0]).to.equal(two);
			expect(deleted[1]).to.equal(three);
		});

	});

	describe("extracting elements", function () {

		it("'slice' can extract the beginning of an array", function () {
			array = ['one', 'two', 'three', 'four', 'five'];

			expect(array.slice(0, 2)).to.deep.equal(['one', 'two']);
		});

		it("'slice' can extract the end of an array", function () {
			array = ['one', 'two', 'three', 'four', 'five'];

			expect(array.slice(2)).to.deep.equal(['three', 'four', 'five']);
		});

		it("'slice' actually extract [start, end[", function () {
			array = ['one', 'two', 'three', 'four', 'five'];

			expect(array.slice(1, 4)).to.deep.equal(['two', 'three', 'four']);
		});

		it("'slice' accepts negative end index", function () {
			array = ['one', 'two', 'three', 'four', 'five'];

			expect(array.slice(1, -2)).to.deep.equal(['two', 'three']);
		});

		it("'slice' resists short array", function () {
			array = ['one', 'two', 'three'];

			expect(array.slice(0, 5)).to.deep.equal(['one', 'two', 'three']);
		});

	});

	describe("2D", function () {

		var grid, A1, B2;

		beforeEach(function () {
			grid = [];
			A1 = { value: "first" }
			B2 = { value: "second" }
		});

		it("can be simulated with arrays of arrays", function () {
			grid[0] = [];
			grid[1] = [];
			grid[0][0] = A1;
			grid[1][1] = B2;

			expect(grid[0][0]).to.equal(A1);
			expect(grid[1][1]).to.equal(B2);
		});
	});

	describe('instanceof Array', function () {

		var isArray = function (o) {
			return o instanceof Array;
		};

		it('returns false for an integer', function () {
			expect(isArray(1)).to.equal(false);
		});

		it('returns false for a string', function () {
			expect(isArray("42")).to.equal(false);
		});

		it('returns true for a empty array', function () {
			expect(isArray([])).to.equal(true);
		});

	});

	describe('Join', function () {

		it('accepts a separator as parameter', function () {
			expect(['A', 'B B'].join('\n')).to.equal('A\nB B');
		});
	});

	describe('Reverse', function () {

		it('modifies the original array', function () {
			var letters = ['a', 'b', 'c'];
			letters.reverse();

			expect(letters).to.deep.equal(['c', 'b', 'a']);
		});

		it('also returns the reverted array', function () {
			expect(['a', 'b', 'c'].reverse()).to.deep.equal(['c', 'b', 'a']);
		});
	});

	describe('Concat', function () {

		it('concatenates the two given arrays', function () {
			expect([1, 2].concat([3, 4])).to.deep.equal([1, 2, 3, 4]);
		});

		it('concatenates the three given arrays', function () {
			expect([1, 2].concat([3, 4], [5, 6])).to.deep.equal([1, 2, 3, 4, 5, 6]);
		});
	});

	describe('From', function () {

		it('creates an array', function () {
			expect(Array.from('hello')).to.deep.equal(['h', 'e', 'l', 'l', 'o']);
		});

		it('accepts a map function', function () {
			expect(Array.from('hello', x => x.toUpperCase())).to.deep.equal(['H', 'E', 'L', 'L', 'O']);
		});
	});

	describe('Sort', function () {

		it('modifies the array', function () {
			let set = [3, 1, 2];
			set.sort();

			expect(set).to.deep.equal([1, 2, 3])
		});

		it('returns the sorted array', function () {
			let set = [3, 1, 2];
			let value = set.sort();

			expect(value).to.deep.equal([1, 2, 3])
		});

		describe('optional comparator', () => {

			it('uses 0 to indicate equality', function () {
				let set = [3, 1, 2];
				set.sort((a, b) => 0);

				expect(set).to.deep.equal([3, 1, 2])
			});

			it('uses +-1 to indicate comparaison', function () {
				let set = [3, 1, 2];
				set.sort((a, b) => {
					if (a < b) return 1;
					if (a > b) return -1;
				});

				expect(set).to.deep.equal([3, 2, 1])
			});

			it('also works with positive/negative', function () {
				let set = [3, 1, 2];
				set.sort((a, b) => a - b);

				expect(set).to.deep.equal([1, 2, 3])
			});
		});
	});
});

var expect = require('chai').expect;

var swap = function(array, i, j) {
    var tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
};
var partitionate = function(array, start, end) {
    var pivot = array[end];
    var indexOfItemLowerThenPivot = start;
    for (var i=indexOfItemLowerThenPivot; i<end; i++) {
        if (array[i] < pivot) {
            swap(array, i, indexOfItemLowerThenPivot);
            indexOfItemLowerThenPivot++;
        }
    }
    swap(array, indexOfItemLowerThenPivot, end);
    return indexOfItemLowerThenPivot;
};
var sort = function(array, start, end) {
    if (start < end) {
        var pivotIndex = partitionate(array, start, end);
        sort(array, 0, pivotIndex-1);
        sort(array, pivotIndex+1, end);
    }
};

describe('Quick sort', function() {

    var array;

    beforeEach(function() {
        array = [7, 9, 1, 3, 5];
    });

    it('can partitionate an array using the last element as pivot', function() {
        partitionate(array, 0, 4);

        expect(array).to.deep.equal([1, 3, 5, 9, 7]);
    });

    it('can partitionate and identify the final index of a pivot', function() {
        var index = partitionate(array, 0, 4);

        expect(index).to.equal(2);
    });

    it('works', function() {
        sort(array, 0, 4);

        expect(array).to.deep.equal([1, 3, 5, 7, 9]);
    });
});

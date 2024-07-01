var expect = require('chai').expect;

describe('Merge sort', function () {
    it('works with 2 elements', function () {
        expect(sort([3, 1])).to.deep.equal([1, 3]);
    });
    it('works with 4 elements', function () {
        expect(sort([4, 3, 2, 1])).to.deep.equal([1, 2, 3, 4]);
    });
    it('works with 5 elements', function () {
        expect(sort([5, 4, 3, 2, 1])).to.deep.equal([1, 2, 3, 4, 5]);
    });
});

var sort = function (array) {
    if (array.length == 1) {
        return array;
    }
    return merge(
        sort(array.slice(0, array.length / 2)),
        sort(array.slice(array.length / 2))
    );
};
var merge = function (a, b) {
    if (a.length == 0) {
        return b;
    }
    if (b.length == 0) {
        return a;
    }
    if (a[0] < b[0]) {
        return [a[0]].concat(merge(a.slice(1), b));
    }
    return [b[0]].concat(merge(a, b.slice(1)));
};

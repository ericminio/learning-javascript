var expect = require('chai').expect;

describe('Binary tree inversion', function () {
    it('starts with 3 elements', () => {
        let head = {
            value: 1,
            left: { value: 2, left: undefined, right: undefined },
            right: { value: 3, left: undefined, right: undefined },
        };
        expect(inverted(head)).to.deep.equal({
            value: 1,
            left: { value: 3, left: undefined, right: undefined },
            right: { value: 2, left: undefined, right: undefined },
        });
    });
    it('needs more attention with 5 elements', () => {
        let head = {
            value: 1,
            left: {
                value: 2,
                left: {
                    value: 4,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 5,
                    left: undefined,
                    right: undefined,
                },
            },
            right: {
                value: 3,
                left: undefined,
                right: undefined,
            },
        };
        expect(inverted(head)).to.deep.equal({
            value: 1,
            left: { value: 3, left: undefined, right: undefined },
            right: {
                value: 2,
                left: {
                    value: 5,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 4,
                    left: undefined,
                    right: undefined,
                },
            },
        });
    });
    it('inverts left and right sides', () => {
        let head = {
            value: 1,
            left: {
                value: 2,
                left: {
                    value: 4,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 5,
                    left: undefined,
                    right: undefined,
                },
            },
            right: {
                value: 3,
                left: {
                    value: 6,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 7,
                    left: undefined,
                    right: undefined,
                },
            },
        };
        expect(inverted(head)).to.deep.equal({
            value: 1,
            left: {
                value: 3,
                left: {
                    value: 7,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 6,
                    left: undefined,
                    right: undefined,
                },
            },
            right: {
                value: 2,
                left: {
                    value: 5,
                    left: undefined,
                    right: undefined,
                },
                right: {
                    value: 4,
                    left: undefined,
                    right: undefined,
                },
            },
        });
    });
});

var inverted = (head) => {
    let tmp = head.left;
    head.left = head.right;
    head.right = tmp;

    if (head.right !== undefined) {
        inverted(head.right);
    }
    if (head.left !== undefined) {
        inverted(head.left);
    }

    return head;
};

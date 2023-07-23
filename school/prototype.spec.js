var expect = require('chai').expect;

describe('Prototype', function () {
    describe('Adding methods to classes', function () {
        it('can be done via the prototype keyword', function () {
            Array.prototype.theFirstItemPlease = function () {
                return this[0];
            };

            var items = ['one', 'two'];

            expect(items.theFirstItemPlease()).to.equal('one');
        });

        it('can be useful for example to compare strings', function () {
            String.prototype.greaterThan = function (other) {
                return this == 'Me';
            };

            expect('Me'.greaterThan('You')).to.equal(true);
        });
    });
});

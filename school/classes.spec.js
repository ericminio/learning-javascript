var expect = require('chai').expect;

describe('Classes', function() {

    var Car = function(color) { this.color = color; }

    describe('Instantiation', function() {

        it('gives an instance', function() {
            var myCar = new Car("blue");

            expect(myCar.color).to.equal("blue");
        });

        it('allows to manipulate different instances', function() {
            var myCar = new Car("blue");
            var yourCar = new Car("red");

            expect(myCar.color).not.to.equal(yourCar.color);
        });

        it('gives instances that equal when all their attributes equal', function() {
            expect(new Car("blue")).to.deep.equal(new Car("blue"));
        });

        it('gives instances that equal when they have no attribute', function() {
            expect(new Car()).to.deep.equal(new Car());
        });

        it('gives different instances though', function() {
            expect(new Car() === new Car()).to.equal(false);
        });
    });
});

he = it;
describe('Enlightment:', function() {
    
    beforeEach(function() {
        spyOn(me, 'meditate');
    });

    describe('Pythagoras', function() {
        
        he('can decompose a number into its prime factors', function() {

            Pythagoras. willYouTell(me, the("prime factors of", 300));    
            expect(me.meditate).toHaveBeenCalledWith([2, 2, 3, 5, 5]);
        });
    });
});

var primeFactorsOf = function(number) {
    
};

var Pythagoras = {
    willYouTell: function(asker, request) {
        asker.meditate(primeFactorsOf(request.number));
    }
};
var me = { meditate: function(answer) {} };
var the = function(subject, parameter) { return { number: parameter }; };
